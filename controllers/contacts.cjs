const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../model/index.cjs')

const getAll = async (req, res, next) => {
  try {
    const contacts = await listContacts()
    res.status(httpStatusCodes.OK).json({
      status: 'success - GET ALL',
      code: httpStatusCodes.OK,

      data: {
        contacts,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'success - GET BY ID',
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

const create = async (req, res, next) => {
  try {
    const contact = await addContact(req.body)
    res.status(httpStatusCodes.CREATED).json({
      status: 'success - POST',
      code: httpStatusCodes.CREATED,
      data: {
        contact,
      },
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const contact = await removeContact(req.params)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'success - DELETE',
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

const update = async (req, res, next) => {
  try {
    const contact = await updateContact(req.params, req.body)
    if (contact) {
      return res.status(httpStatusCodes.OK).json({
        status: 'success - PUT',
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

module.exports = { getAll, getById, create, remove, update }
