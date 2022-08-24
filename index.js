require('dotenv').config()
const {getComments, createComment, updateComment, deleteComment} = require('./controllers').Comment
require('./controllers').Comment
require('./db').connect()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

const PORT = process.env.PORT || 3300

/* Middleware */
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use(cookieParser())

/* 404 route */
app.get('*', (req, res) => res.send('404 Not Found'))
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})
