const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    const isAccept = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
    .find(acceptedFormat => acceptedFormat == file.mimetype)

    if (isAccept) {
        return cb(null, true)
    }

    return cb(null, false)
}

module.exports = multer({
    storage,
    fileFilter
})