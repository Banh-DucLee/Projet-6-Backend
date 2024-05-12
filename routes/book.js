const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { upload, processImage } = require('../middlewares/upload');
const bookCtrl = require('../controllers/book');

router.get('/bestrating', bookCtrl.getBestRating);
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getBook);
router.post('/', auth, upload.single('image'), processImage, bookCtrl.createBook);
router.put('/:id', auth, upload.single('image'), processImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;