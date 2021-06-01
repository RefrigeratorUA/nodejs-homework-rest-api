const sendgrid = require('@sendgrid/mail')
const Mailgen = require('mailgen')
require('dotenv').config()

class EmailService {
  #sender = sendgrid
  #GenerateTemplate = Mailgen
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000'
        break
      case 'production':
        this.link = 'https://shd-rest-api-nodejs23.herokuapp.com'
        break
      default:
        this.link = 'http://localhost:3000'
        break
    }
  }

  #createTemplateVerifyEmail(verifyToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'salted',
      product: {
        name: 'GoIT Node23. Contacts REST API',
        link: this.link,
      },
    })
    const email = {
      body: {
        name,
        intro: "Welcome to Contacts REST API! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Contacts REST API, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/users/verify/${verifyToken}`,
          },
        },
      },
    }
    const emailBody = mailGenerator.generate(email)
    return emailBody
  }

  async sendVerifyEmail(verifyToken, email, name) {
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: email,
      from: 'support@comds.com.ua',
      subject: 'Verify email',
      html: this.#createTemplateVerifyEmail(verifyToken, name),
    }

    this.#sender.send(msg)
  }
}

module.exports = EmailService
