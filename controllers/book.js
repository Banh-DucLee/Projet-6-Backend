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
    Book.find().sort({averageRating: -1}).limit(3).then(books => {
        res.status(200).json(
            books
        );
    }).catch(error => {
        res.status(400).json({
            error
        });
    })
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
    Book.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id}).then(() => {
        res.status(200).json({
            message: 'Book modified successfully'
        });
    }).catch(error => {
        res.status(400).json({
            error
        });
    })
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

exports.rateBook = async (req, res, next) => {
    const {userId, rating} = req.body;

    const book = await Book.findOne({_id: req.params.id});

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    const alreadyRated = book.ratings.find(element => element.userId === userId);

    if (alreadyRated) {
        return res.status(400).json({
            message: 'User already rated this book'
        });
    }

    book.ratings.push({
        userId: userId,
        grade: rating
    });

    const totalRatings = book.ratings.length;

    let totalGrade = 0;
    book.ratings.forEach(rating => {
        totalGrade += rating.grade;
    });

    book.averageRating = totalRatings === 0 ? 0 : totalGrade / totalRatings;

    book.save().then(() => {
        res.status(200).json(
            book
        );
    }).catch(error => {
        res.status(400).json({
            error
        });
    });
};
