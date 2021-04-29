const Contact = require('../schemas/contact.cjs')

class ContactsRepository {
  constructor() {
    this.model = Contact
  }

  async getAll() {
    const results = await this.model.find({})
    return results
  }

  async getById(id) {
    const result = await this.model.findById(id)
    return result
  }

  async create(body, userId) {
    const result = await this.model.create({ ...body, owner: userId })
    return result
  }

  async remove(id) {
    const result = await this.model.findByIdAndRemove(id)
    return result
  }

  async update(id, body) {
    const result = await this.model.findByIdAndUpdate(id, { ...body }, { new: true })
    return result
  }
}

module.exports = ContactsRepository
