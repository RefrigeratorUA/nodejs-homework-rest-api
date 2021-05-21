const { UsersRepository } = require('../repositories/index.cjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

class AuthService {
  constructor() {
    this.repositories = { users: new UsersRepository() }
  }

  async login({ email, password }) {
    const user = await this.repositories.users.findByEmail(email)
    if (!user) return null
    if (!user.verify) return null
    const id = user.id
    await this.logout(id)
    const isValidPassword = await user.validPassword(password)
    if (!isValidPassword) return null
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' })
    await this.repositories.users.updateToken(id, token)
    return token
  }

  async logout(id) {
    return await this.repositories.users.updateToken(id, null)
  }

  async verifyUser(token) {
    return await this.repositories.users.findByVerifyTokenEmail(token)
  }
}

module.exports = AuthService
