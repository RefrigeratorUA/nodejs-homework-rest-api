const { UsersService } = require('../services/index.cjs')
const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
}

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const service = new UsersService()
      const user = await service.findByID(payload.id)
      if (!user) {
        return done(
          new Error({
            status: httpStatusCodes.NOT_FOUND,
            message: 'Not Found User',
            data: 'Not Found',
          }),
        )
      }
      if (!user.token) {
        return done(null, false)
      }
      return done(null, user)
    } catch (error) {
      done(error)
    }
  }),
)