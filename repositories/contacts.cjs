const { ObjectID } = require('mongodb')
const { ErrorHandler } = require('../helpers/errorHandler.cjs')
const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')

class ContactsRepository {
  constructor(client) {
    this.collection = client.db().collection('contacts')
  }

  #getMongoId(id) {
    try {
      return ObjectID(id)
    } catch (error) {
      throw new ErrorHandler(
        httpStatusCodes.BAD_REQUEST,
        `MongoDB _id: ${error.message}`,
        'Bad Request',
      )
    }
  }

  async getAll() {
    const results = await this.collection.find({}).toArray()
    return results
  }

  async getById(id) {
    const contactID = this.#getMongoId(id)
    const [result] = await this.collection.find({ _id: contactID }).toArray()
    return result
  }

  async create(body) {
    const item = {
      ...body,
      ...(body.favorite ? {} : { favorite: false }),
    }
    const {
      ops: [result],
    } = await this.collection.insertOne(item)
    return result
  }

  async remove(id) {
    const contactID = this.#getMongoId(id)
    const { value: result } = await this.collection.findOneAndDelete({ _id: contactID })
    return result
  }

  async update(id, body) {
    const contactID = this.#getMongoId(id)
    const { value: result } = await this.collection.findOneAndUpdate(
      { _id: contactID },
      { $set: body },
      { returnOriginal: false },
    )
    return result
  }
}

module.exports = ContactsRepository
