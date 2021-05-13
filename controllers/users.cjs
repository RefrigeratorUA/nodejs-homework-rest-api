const { AuthService, UsersService } = require('../services/index.cjs')
const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')
const authService = new AuthService()
const usersService = new UsersService()

const registration = async (req, res, next) => {
  const { name, email, password, subscription } = req.body
  const user = await usersService.findByEmail(email)
  if (user) {
    return next({
      status: 'error',
      code: httpStatusCodes.CONFLICT,
      message: 'This email is already use',
      data: 'Conflict',
    })
  }
  try {
    const { id, subscription: newSubscription } = await usersService.createContact({
      name,
      email,
      password,
      subscription,
    })
    return res.status(httpStatusCodes.CREATED).json({
      status: 'success',
      code: httpStatusCodes.CREATED,
      message: 'registration done',
      data: {
        id,
        email,
        subscription: newSubscription,
      },
    })
  } catch (error) {
    return next(error)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const token = await authService.login({ email, password })
    if (token) {
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'login done',
        data: {
          token,
        },
      })
    }
    next({
      status: 'error',
      code: httpStatusCodes.UNAUTHORIZED,
      message: 'Invalid credentials',
      data: 'Unauthorized',
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  const id = req.user.id
  await authService.logout(id)
  return res.status(httpStatusCodes.NO_CONTENT).json({})
}

const updateSubscription = async (req, res, next) => {
  try {
    const id = req.user?.id
    const user = await usersService.update(id, req.body)
    if (user) {
      const { email, subscription } = user
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'user subscription is update',
        data: {
          email,
          subscription,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not Found User',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

const getCurrent = async (req, res, next) => {
  try {
    const token = await req.user?.token
    const user = await usersService.findByToken(token)
    if (user) {
      const { email, subscription } = user
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'current user info',
        data: {
          email,
          subscription,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'Not Found User',
        data: 'Not Found',
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  registration,
  login,
  logout,
  updateSubscription,
  getCurrent,
}
