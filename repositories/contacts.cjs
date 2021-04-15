const { v4: uuid } = require('uuid')
const db = require('../db/db.cjs')

const getAll = () => {
  return db.get('contacts').value()
}

const getById = ({ contactId }) => {
  return db.get('contacts').find({ id: contactId }).value()
}

const remove = ({ contactId }) => {
  const [item] = db.get('contacts').remove({ id: contactId }).write()
  return item
}

const create = body => {
  const item = {
    id: uuid(),
    ...body,
  }
  db.get('contacts').push(item).write()
  return item
}

const update = (contactId, body) => {
  const item = db.get('contacts').find({ id: contactId }).assign(body).value()
  db.write()
  return item.id ? item : null
}

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
}
