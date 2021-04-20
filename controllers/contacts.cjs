const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')
const { ContactsService } = require('../services/index.cjs')
const contactsService = new ContactsService()

const listContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.getAll()
    res.status(httpStatusCodes.OK).json({
      status: 'GET ALL - success',
      code: httpStatusCodes.OK,

      data: {
        contacts,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId: id } = req.params
    const contact = await contactsService.getById(id)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'GET BY ID - success',
        code: httpStatusCodes.OK,
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: httpStatusCodes.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const addContact = async (req, res, next) => {
  try {
    const contact = await contactsService.create(req.body)
    res.status(httpStatusCodes.CREATED).json({
      status: 'POST - success',
      code: httpStatusCodes.CREATED,
      data: {
        contact,
      },
    })
  } catch (error) {
    next(error)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const { contactId: id } = req.params
    const contact = await contactsService.remove(id)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'DELETE - success',
        message: 'contact deleted',
        code: httpStatusCodes.OK,
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: httpStatusCodes.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const { contactId: id } = req.params
    const contact = await contactsService.update(id, req.body)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'PUT - success',
        code: httpStatusCodes.OK,
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: httpStatusCodes.NOT_FOUND,
        message: 'Not Found Contact',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
