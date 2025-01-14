const { UsersRepository } = require('../repositories/index.cjs')

class UsersService {
  constructor() {
    this.repositories = { users: new UsersRepository() }
  }

  async findById(id) {
    const data = await this.repositories.users.findById(id)
    return data
  }

  async findByEmail(email) {
    const data = await this.repositories.users.findByEmail(email)
    return data
  }

  async findByToken(token) {
    const data = await this.repositories.users.findByToken(token)
    return data
  }

  async createContact(body) {
    const data = await this.repositories.users.createContact(body)
    return data
  }

  async update(id, body) {
    const data = await this.repositories.users.update(id, body)
    return data
  }

  async updateAvatar(id, avatarUrl, idCloudAvatar) {
    const data = await this.repositories.users.updateAvatar(id, avatarUrl, idCloudAvatar)
    return data
  }
}

module.exports = UsersService
