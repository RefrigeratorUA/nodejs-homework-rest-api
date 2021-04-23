const Contact = require('../schemas/contacts.cjs')

class ContactsRepository {
  constructor() {
    this.model = Contact
  }

  async getAll() {
    const results = await this.model.find({})
    return results
  }

  async getById(id) {
    const result = await this.model.findById({ _id: id })
    return result
  }

  async create(body) {
    const result = await this.model.create(body)
    return result
  }

  async remove(id) {
    const result = await this.model.findByIdAndRemove({ _id: id })
    return result
  }

  async update(id, body) {
    const result = await this.model.findByIdAndUpdate({ _id: id }, { ...body }, { new: true })
    return result
  }
}

module.exports = ContactsRepository
