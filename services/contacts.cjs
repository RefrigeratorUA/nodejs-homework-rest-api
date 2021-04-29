const { ContactsRepository } = require('../repositories/index.cjs')

class ContactsService {
  constructor() {
    this.repositories = { contacts: new ContactsRepository() }
  }

  async getAll() {
    const data = await this.repositories.contacts.getAll()
    return data
  }

  async getById(id) {
    const data = await this.repositories.contacts.getById(id)
    return data
  }

  async remove(id) {
    const data = await this.repositories.contacts.remove(id)
    return data
  }

  async create(body, userId) {
    const data = await this.repositories.contacts.create(body, userId)
    return data
  }

  async update(id, body) {
    const data = await this.repositories.contacts.update(id, body)
    return data
  }
}

module.exports = ContactsService
