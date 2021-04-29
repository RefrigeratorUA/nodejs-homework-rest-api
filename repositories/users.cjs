const User = require('../schemas/user.cjs')

class UsersRepository {
  constructor() {
    this.model = User
  }

  async findByID(id) {
    return await this.model.findById(id)
  }

  async findByEmail(email) {
    return await this.model.findOne({ email })
  }

  async createContact(data) {
    // eslint-disable-next-line new-cap
    const user = new this.model(data)
    return await user.save()
  }

  async updateToken(id, token) {
    return await this.model.updateOne({ _id: id }, { token })
  }
}

module.exports = UsersRepository
