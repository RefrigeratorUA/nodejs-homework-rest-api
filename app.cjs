const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const { httpStatusCodes } = require('./helpers/httpstatuscodes.cjs')

const usersRouter = require('./routes/users/index.cjs')
const contactsRouter = require('./routes/contacts/index.cjs')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(
  cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: httpStatusCodes.NO_CONTENT,
  }),
)
app.use(express.json())

app.use('/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(httpStatusCodes.NOT_FOUND).json({
    status: 'error',
    code: httpStatusCodes.NOT_FOUND,
    message: `Use api on routes ${req.baseUrl}/api/contacts`,
    data: 'Not Found',
  })
})

app.use((err, req, res, next) => {
  err.status = err.status ? err.status : httpStatusCodes.INTERNAL_SERVER_ERROR
  res.status(err.status).json({
    status: err.status === 500 ? 'fail' : 'error',
    code: err.status,
    message: err.message,
    data: err.status === 500 ? 'Internal Server Error' : err.data,
  })
})

module.exports = app
