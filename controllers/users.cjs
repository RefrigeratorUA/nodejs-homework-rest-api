const { AuthService, UsersService } = require('../services/index.cjs')
const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')
const authService = new AuthService()
const usersService = new UsersService()

const registration = async (req, res, next) => {
  const { name, email, password, subscription } = req.body
  const user = await usersService.findByEmail(email)
  if (user) {
    return next({
      status: httpStatusCodes.CONFLICT,
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
        data: {
          token,
        },
      })
    }
    next({
      status: httpStatusCodes.UNAUTHORIZED,
      message: 'Invalid credentials',
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

module.exports = {
  registration,
  login,
  logout,
}
