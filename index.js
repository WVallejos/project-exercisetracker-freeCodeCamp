const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./myDB')
const db = connectDB();
const User = require('./models/users')
const Exercise = require('./models/exercise')
const Log = require('./models/log')


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false}, {limit: '50mb'}));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async function(req, res) {
  try {
    const { username } = req.body
    const user = await User.find({username: username})
    if (user.length > 0) {
      res.json(user[0])
    } else {
      const new_user = new User({username: username})
      const user_saved = await new_user.save()
      res.json(user_saved)
    }
  } catch (error) {
    console.log(error);
  }
})

app.post('/api/users/:id/exercises', async function(req,res) {
  try {
    const {description, duration, date} = req.body;
    const {id} = req.params
    let string_date = '';
    if (!date) {
      string_date = new Date(Date.now()).toDateString();
    }
    else {
      const date_number = Number(date);
      (date_number) ? string_date = new Date(date_number).toDateString() : string_date = new Date(date).toDateString();
    }
    const user = await User.find({_id: id})
    if (user) {
      const exercise = new Exercise(
        {
          username: user[0].username,
          description: description,
          duration: Number(duration),
          date: string_date
        }
      )
      const new_exercise = await exercise.save()
      const log = await Log.findOne({username: user[0].username})
      if (log) {
        log.log.push({
          description: new_exercise.description,
          duration: new_exercise.duration,
          date: new_exercise.date
        })
        await log.save()
      } else {
        const newlog = new Log(
          {
            username: user[0].username,
            _id: user[0]._id,
            log: [{
              description: new_exercise.description,
              duration: new_exercise.duration,
              date: new_exercise.date
            }]
          }
        )
        newlog.save()
      }
      res.json({ username: user[0].username, description: new_exercise.description, duration: new_exercise.duration, date: new_exercise.date, _id: user[0]._id })
    }

  } catch (error) {
    console.log(error);
    res.json({error: error})
  }
})

app.get('/api/users', async function(req, res) {
  const allusers = await User.find()
  res.json(allusers)
})

app.get('/api/users/:_id/logs', async function(req,res) {
  try {
    const {_id} = req.params
    const {from, to, limit} = req.query
    let from_date = ''
    let to_date = new Date(Date.now())
    let limitOfLogs = '' 
    if (from) from_date = new Date(from)
    if (to) to_date = new Date(to)
     
    const user = await User.find({_id: _id})
    if (user) {
      const log = await Log.find({_id: _id})
      console.log(log[0]);
      console.log(from_date);
      console.log(to_date);
      (limit) ? limitOfLogs = Number(limit) : limitOfLogs = log[0].log.length
      const logs_arr = log[0].log
      .filter((l) => {
        const log_date = new Date(l.date)
        return (log_date > from_date && log_date < to_date)
      })
      .slice(0, limitOfLogs)
      res.json({username: user[0].username, count: limitOfLogs, _id: user[0]._id, log: logs_arr})
    }
  } catch (error) {
    console.log(error);
    res.json({error: error})
  }

})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
