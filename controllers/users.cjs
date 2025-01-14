const { AuthService, UsersService } = require('../services/index.cjs')
const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')
const { saveAvatarUserCloud } = require('../helpers/save-avatar-cloud.cjs')
const EmailService = require('../services/email.cjs')

const authService = new AuthService()
const usersService = new UsersService()

require('dotenv').config()

const registration = async (req, res, next) => {
  const user = await usersService.findByEmail(req.body.email)
  if (user) {
    return next({
      status: 'error',
      code: httpStatusCodes.CONFLICT,
      message: 'This email is already use',
      data: 'Conflict',
    })
  }
  try {
    const newUser = await usersService.createContact(req.body)
    const { id, name, email, subscription, avatar, verifyTokenEmail } = newUser

    try {
      const emailService = new EmailService(process.env.NODE_ENV)
      await emailService.sendVerifyEmail(verifyTokenEmail, email, name)
    } catch (error) {
      console.log(error.message)
    }

    return res.status(httpStatusCodes.CREATED).json({
      status: 'success',
      code: httpStatusCodes.CREATED,
      message: 'registration done',
      data: {
        id,
        email,
        subscription,
        avatar,
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
      const { email, subscription, avatar } = user
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'current user info',
        data: {
          email,
          subscription,
          avatar,
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

const updateAvatar = async (req, res, next) => {
  try {
    const { id } = req.user
    const { idCloudAvatar, avatarUrl } = await saveAvatarUserCloud(req)
    await usersService.updateAvatar(id, avatarUrl, idCloudAvatar)
    return res.status(httpStatusCodes.OK).json({
      status: 'success',
      code: httpStatusCodes.OK,
      message: 'user avatar is update',
      data: { avatarUrl },
    })
  } catch (error) {
    next(error)
  }
}

const verifyUser = async (req, res, next) => {
  try {
    const user = await authService.verifyUser(req.params.token)
    if (user) {
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'Verification done',
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.BAD_REQUEST,
        message: "Your verification token isn't valid. Contact to support",
        data: 'Unauthorized',
      })
    }
  } catch (error) {
    next(error)
  }
}

const repeatEmailVerify = async (req, res, next) => {
  try {
    const user = await usersService.findByEmail(req.body.email)
    if (user) {
      const { name, verifyTokenEmail, email } = user
      const emailService = new EmailService(process.env.NODE_ENV)
      await emailService.sendVerifyEmail(verifyTokenEmail, email, name)
      return res.status(httpStatusCodes.OK).json({
        status: 'success',
        code: httpStatusCodes.OK,
        message: 'Verification email resubmitted',
        data: {
          email,
        },
      })
    } else {
      return next({
        status: 'error',
        code: httpStatusCodes.NOT_FOUND,
        message: 'User not found',
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
  updateAvatar,
  verifyUser,
  repeatEmailVerify,
}
