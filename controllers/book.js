const Book = require('../models/book');

exports.getAllBooks = (req, res, next) => {
    Book.find().then(books => {
        res.json(books);
    }).catch(error => {
        res.status(400).json({
            error
        });
    })
};

exports.getBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id}).then(book => {
        res.status(200).json(
            book
        );
    }).catch(error => {
        res.status(404).json({
            error
        });
    })
};

exports.getBestRating = (req, res, next) => {

};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save().then( () => {
        res.status(201).json({
            message: 'Book created successfully'
        });
    }).catch(error => {
        res.status(400).json({
            error
        });
    })
};

exports.modifyBook = (req, res, next) => {

};

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id}).then(() => {
        res.status(200).json({
            message: 'Book deleted successfully'
        });
    }).catch(error => {
        res.status(400).json({
            error
        });
    })
};

exports.rateBook = (req, res, next) => {

};
