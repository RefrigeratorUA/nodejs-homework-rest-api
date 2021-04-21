const express = require('express')
const router = express.Router()
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contacts.cjs')
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateFavorite,
} = require('../../validation/contacts.cjs')

router
  .get('/', listContacts)
  .get('/:contactId', getContactById)
  .post('/', validateCreateContact, addContact)
  .delete('/:contactId', removeContact)
  .put('/:contactId', validateUpdateContact, updateContact)
  .patch('/:contactId/favorite', validateUpdateFavorite, updateStatusContact)
module.exports = router
