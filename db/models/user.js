const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'user name is required'],
    min: 5,
    max: 128,
  },
  email: {
    type: String,
    required: [true, 'user email is required'],
    unique: true,
    min: 5,
    max: 128,
    match: [/^\S+@\S+$/g, 'invalid email format']
  },
  passwordHash: {
    type: String,
    required: [true, 'password is required'],
    min: 4,
    max: 128
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User