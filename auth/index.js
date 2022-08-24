const {User:userModel} = require('../db/models')
const jwt = require('jsonwebtoken')

const getToken = req => {
  const JWT_KEY = process.env.JWT_KEY_NAME || 'jwt'
  console.log('headers',req.headers.authorization)
  if (req.headers.authorization) return req.headers.authorization
  if (req.cookies[JWT_KEY]) return req.cookies[JWT_KEY]
  return null
}

const auth = async (req, res, next) => {
  console.log(req.url)
  const token = getToken(req)

  console.log(token)

  if (!token) {
    if ((req.url = '/')) {
      return res.json('please login')
    }
    return res.status(401).send({ success: false, message: 'unauthorized' })
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET)

  if (!payload) {
    if ((req.url = '/')) {
        return res.json('please login')
    }
    return res.status(401).send({ success: false, message: 'unauthorized' })
  }

  const user = await userModel.findOne({ email: payload?.email }).exec()

  if (!user) {
    if ((req.url = '/')) {
        return res.json('please login')
    }
    return res.status(401).send({ success: false, message: 'unauthorized' })
  }

  if (!req.loggedInUser) {
    Object.defineProperty(req, 'loggedInUser', {
      value: user,
      writable: false
    })
  } else {
    throw new Error('loggedInUser property already exists')
  }

  next()
}

// unused in this app - carried over from the bookstore app
const adminAuth = async (req, res, next) => {
  if (!req.loggedInUser.isAdmin) {
    res.status(401).send({ success: false, message: 'unauthorized' })
    return
  }
  next()
}

module.exports = { auth, adminAuth }