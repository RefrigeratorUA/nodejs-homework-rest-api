const fs = require('fs/promises')
const path = require('path')
const jimp = require('jimp')
require('dotenv').config()
const AVATARS_DIR = process.env.AVATARS_DIR

const saveAvatarUserLocal = async req => {
  const { id } = req.user
  const pathFile = req.file.path
  const newFileName = `${id}-${req.file.originalname}`
  const img = await jimp.read(pathFile)
  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile)

  try {
    const oldAvatar = req.user.avatar
    if (Object.values(oldAvatar).join('').includes(`${AVATARS_DIR}/`)) {
      await fs.unlink(path.join(process.cwd(), 'public', oldAvatar))
    }

    await fs.rename(pathFile, path.join(process.cwd(), 'public', AVATARS_DIR, newFileName))
  } catch (error) {
    console.log(error.message)
  }

  return path.join(AVATARS_DIR, newFileName).replace('\\', '/')
}

module.exports = {
  saveAvatarUserLocal,
}
