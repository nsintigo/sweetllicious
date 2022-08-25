require('dotenv').config()
const mongoose = require('mongoose')
const seedComments = require('./seeder/seedData.json')
const CommentModel = require('./db/models/comments')
const UserModel = require('./db/models/user')
const bcrypt = require('bcryptjs');
const comment = require('./db/models/comments')
const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.hlhgj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
console.log(uri)

const seedDB = async () => {
  try {
    // connect
    await mongoose.connect(uri)
    console.info('mongodb connection opened')

    // seed
    if (process.argv[2] === '--override') {
      await CommentModel.deleteMany({})
      await UserModel.deleteMany({})
    }
    const testUser = await UserModel.create({name:'test user',email:'test@sample.com', passwordHash: bcrypt.hashSync('123456',10) })
    const commentsToSeed = seedComments.map(comment => {return {userId:testUser._id,...comment}} )
    await CommentModel.insertMany(commentsToSeed)

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