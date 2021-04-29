const express = require('express')
const router = express.Router()
const { registration, login, logout } = require('../../controllers/users.cjs')
const { validateRegistrationUser, validateLoginUser } = require('../../validation/users.cjs')
const guard = require('../../helpers/guard.cjs')

router.post('/signup', validateRegistrationUser, registration)
router.post('/login', validateLoginUser, login)
router.post('/logout', guard, logout)

module.exports = router
