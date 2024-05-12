const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function processImage(req, res, next) {
    const { buffer, originalname } = req.file;
    const name = originalname.split('.').slice(0, -1).join('.');
    const ref = `${new Date().toISOString()}_${name.split(' ').join('_')}.webp`;
    sharp(buffer).webp({quality: 20}).toFile(`images/${ref}`, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Something went wrong' });
        }

        req.file.filename = ref;

        next();
    });
}

module.exports = { upload, processImage };