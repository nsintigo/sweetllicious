const mongoose = require('mongoose')

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.hlhgj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
const connect = () => {
    mongoose.connect(uri).catch(err => {
        console.error(err)
    })

    mongoose.connection.on('open', () => {
        console.log('Mongoose connected successfully')
    })
}

module.exports = {
    uri,
    connect
}