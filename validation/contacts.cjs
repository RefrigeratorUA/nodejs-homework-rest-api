const Joi = require('joi')
const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')

const schemaCreateContact = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  phone: Joi.string().min(3).max(15).required(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .optional(),
  phone: Joi.string().min(3).max(15).optional(),
}).min(1)

const validate = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: httpStatusCodes.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
      data: 'Bad Request',
    })
  }
  return next()
}

module.exports.validateCreateContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next)
}

module.exports.validateUpdateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
