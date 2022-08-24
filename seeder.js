require('dotenv').config()
const mongoose = require('mongoose')
const seedComments = require('./seeder/seedData.json')
const CommentModel = require('./db/models/comments')
const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@clipsyncdb.04ucmol.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
console.log(uri)

const seedDB = async () => {
  try {
    // connect
    await mongoose.connect(uri)
    console.info('mongodb connection opened')

    // seed
    if (process.argv[2] === '--override') {
      await CommentModel.deleteMany({})
    }
    await CommentModel.insertMany(seedComments)

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