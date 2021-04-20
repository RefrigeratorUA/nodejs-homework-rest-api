const express = require('express')
const router = express.Router()
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../controllers/contacts.cjs')
const { validateCreateContact, validateUpdateContact } = require('../../validation/contacts.cjs')

router
  .get('/', listContacts)
  .get('/:contactId', getContactById)
  .post('/', validateCreateContact, addContact)
  .delete('/:contactId', removeContact)
  .put('/:contactId', validateUpdateContact, updateContact)

module.exports = router
