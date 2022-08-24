require('dotenv').config()
const {getComments, createComment, updateComment, deleteComment} = require('./controllers').Comment
const { login, register } = require('./controllers').User
require('./controllers').Comment
require('./db').connect()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const { auth } = require('./auth')

const app = express()

const PORT = process.env.PORT || 3300

/* Middleware */
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use(cookieParser())
app.use(morgan('dev'));

/* User routes */

app.post('/api/v1/users/login', login)
app.post('/api/v1/users/register', register)

app.use(auth)
app.route('/api/v1/comment/:_id').patch(updateComment).delete(deleteComment)
app.route('/api/v1/comments').get(getComments).post(createComment)

/* 404 route */
app.get('*', (req, res) => res.send('404 Not Found'))
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})
