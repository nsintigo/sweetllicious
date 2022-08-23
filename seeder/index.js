require('dotenv').config()
const mongoose = require('mongoose')
const seedComments = require('./seedData.json')
const CommentModel = require('../models/comments')
const { uri } = require('../')

const seedDB = async () => {
  try {
    // connect
    await mongoose.connect(uri)
    console.info('mongodb connection opened')

    // seed
    if (process.argv[2] === '--override') {
      await CommentModel.deleteMany({})
    }
    await ToDoModel.insertMany(seedComments)

    // assert & feedback
    await CommentModel.find().exec()
    console.info('data seeding completed')
  } catch (err) {
    // log errors
    console.error('mongodb seed script error: ', err.message)
  } finally {
    // disconnect
    await mongoose.connection.close()
    console.info('mongodb connection closed')
  }
}

seedDB()