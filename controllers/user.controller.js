const userModel = require('../db/models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).exec()

    if (!user) {
      res.status(401).send({ message: 'Incorrect email or password' })
      return
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      res.status(401).send({ message: 'Incorrect email or password' })
      return
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    })

    const JWT_KEY = process.env.JWT_KEY_NAME || 'jwt'
    res
      .header({ JWT_KEY: token }) // inject jwt in headers
      .cookie(JWT_KEY, token) // inject jwt in cookies
      .send({ token }) // keep token in body
  } catch (e) {
    res
      .status(500)
      .send({ message: 'Something went wrong. Please try again shortly!' })
  }
}

const register = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(422).send('wrong email or password')
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await userModel.create({ email, passwordHash })
    res.send(user)
  } catch (e) {
    res.status(500).send(e.message)
  }
}

module.exports = {
  login,
  register
}
