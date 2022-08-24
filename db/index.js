const mongoose = require('mongoose')

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@clipsyncdb.04ucmol.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
console.log(uri)
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