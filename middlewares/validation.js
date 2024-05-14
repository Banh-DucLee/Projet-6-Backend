const { body, validationResult } = require('express-validator');

module.exports = [
    body('email').isEmail(),
    body('password').notEmpty(),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()
            });
        }
        next();
    }
];

