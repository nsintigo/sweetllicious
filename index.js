require('dotenv').config()
require('./db').connect()

/*const routes = require("./routes/comments")*/


const {getComments, createComment, updateComment, deleteComment} = require('./controllers')

const express = require('express')
const mongoose = require('mongoose')
const app = express()

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.hlhgj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(uri, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error=> console.log(error))


const PORT = process.env.PORT || 3300

/* Middleware */
app.use(express.json())


app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})
