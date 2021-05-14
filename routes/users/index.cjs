const express = require('express')
const router = express.Router()
const {
  registration,
  login,
  logout,
  updateSubscription,
  getCurrent,
} = require('../../controllers/users.cjs')
const {
  validateRegistrationUser,
  validateLoginUser,
  validatesUpdateSubscription,
} = require('../../validation/users.cjs')
const guard = require('../../helpers/guard.cjs')
const rateLimit = require('express-rate-limit')
const { httpStatusCodes } = require('../../helpers/httpstatuscodes.cjs')

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes (first param)
  max: 2, // limit each IP to 2 requests per windowMs
  handler: (req, res, next) => {
    return res.status(httpStatusCodes.TOO_MANY_REQUESTS).json({
      status: 'error',
      code: httpStatusCodes.TOO_MANY_REQUESTS,
      message: 'Too Many Requests',
      data: 'HTTP_TOO_MANY_REQUESTS',
    })
  },
})

router.patch('/', guard, validatesUpdateSubscription, updateSubscription)

router.get('/current', guard, getCurrent)

router.post('/signup', limiter, validateRegistrationUser, registration)
router.post('/login', validateLoginUser, login)
router.post('/logout', guard, logout)

module.exports = router
