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
  validateObjectId,
} = require('../../validation/contacts.cjs')
const guard = require('../../helpers/guard.cjs')

router.get('/', guard, listContacts).post('/', guard, validateCreateContact, addContact)

router
  .get('/:contactId', guard, validateObjectId, getContactById)
  .put('/:contactId', [guard, validateObjectId, validateUpdateContact], updateContact)
  .delete('/:contactId', guard, validateObjectId, removeContact)

router.patch(
  '/:contactId/favorite',
  [guard, validateObjectId, validateUpdateFavorite],
  updateStatusContact,
)

module.exports = router
