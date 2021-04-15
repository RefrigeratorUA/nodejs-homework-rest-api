const { getAll, getById, remove, create, update } = require('../repositories/index.cjs')

const listContacts = async () => {
  const data = await getAll()
  return data
}

const getContactById = async contactId => {
  const data = await getById(contactId)
  return data
}

const removeContact = async contactId => {
  const data = await remove(contactId)
  return data
}

const addContact = async body => {
  const data = await create(body)
  return data
}

const updateContact = async ({ contactId }, body) => {
  const data = await update(contactId, body)
  return data
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
