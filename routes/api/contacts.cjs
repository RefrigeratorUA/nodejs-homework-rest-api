const express = require('express')
const router = express.Router()
const { getAll, getById, create, remove, update } = require('../../controllers/contacts.cjs')
const { validateCreateContact, validateUpdateContact } = require('../../validation/contacts.cjs')

router
  .get('/', getAll)
  .get('/:contactId', getById)
  .post('/', validateCreateContact, create)
  .delete('/:contactId', remove)
  .put('/:contactId', validateUpdateContact, update)

module.exports = router
