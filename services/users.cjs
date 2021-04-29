const { UsersRepository } = require('../repositories/index.cjs')

class UsersService {
  constructor() {
    this.repositories = { users: new UsersRepository() }
  }

  async findByID(id) {
    const data = await this.repositories.users.findByID(id)
    return data
  }

  async findByEmail(email) {
    const data = await this.repositories.users.findByEmail(email)
    return data
  }

  async createContact(body) {
    const data = await this.repositories.users.createContact(body)
    return data
  }
}

module.exports = UsersService
