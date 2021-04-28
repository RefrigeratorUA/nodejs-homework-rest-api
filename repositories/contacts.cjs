const Contact = require('../schemas/contacts.cjs')

class ContactsRepository {
  async getAll() {
    const results = await Contact.find({})
    return results
  }

  async getById(id) {
    const result = await Contact.findById({ _id: id })
    return result
  }

  async create(body) {
    const result = await Contact.create(body)
    return result
  }

  async remove(id) {
    const result = await Contact.findByIdAndRemove({ _id: id })
    return result
  }

  async update(id, body) {
    const result = await Contact.findByIdAndUpdate({ _id: id }, { ...body }, { new: true })
    return result
  }
}

module.exports = ContactsRepository
