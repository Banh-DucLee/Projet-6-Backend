const Book = require('../models/book');
const fs = require('fs');

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

    if ( bookObject.ratings[0].grade === 0) {
        delete bookObject.ratings[0];
    }

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
        const filename = book.imageUrl.split('/').pop();
        fs.unlinkSync(`images/${filename}`);
        res.status(400).json({
            error
        });
    })
};

exports.modifyBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const update = {...req.body};
        delete update._id;

        if (req.file) {
            const bookObject = await Book.findOne({_id: bookId});
            if (bookObject.imageUrl) {
                const filename = bookObject.imageUrl.split('/').pop();
                fs.unlinkSync(`images/${filename}`);
            }
            update.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        await Book.findByIdAndUpdate(bookId, update);

        res.status(200).json({
            message: 'Book modified successfully'
        });

    } catch (error) {
        res.status(400).json({
            error
        });
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({_id: req.params.id});
        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }
        const filename = book.imageUrl.split('/').pop();

        fs.unlinkSync(`images/${filename}`);

        await Book.deleteOne({_id: req.params.id});

        res.status(200).json({
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
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

    const avgRating = totalRatings === 0 ? 0 : totalGrade / totalRatings;

    book.averageRating = Number.isInteger(avgRating) ? avgRating : Math.round(avgRating);

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
