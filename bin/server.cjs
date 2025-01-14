const db = require('../db/db.cjs')
const app = require('../app.cjs')

const PORT = process.env.PORT || 3000

;(async db => {
  try {
    await db
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  } catch (err) {
    console.log(`Server not running. Error message: ${err.message}`)
    process.exit(1)
  }
})(db)
