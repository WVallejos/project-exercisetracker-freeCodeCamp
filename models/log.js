const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
    username: String,
    log: [{
        _id: false,
        description: String,
        duration: Number,
        date: String,
    }],
  }, { versionKey: false });

module.exports = mongoose.model('Log', logSchema)