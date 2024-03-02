const { body, validationResult } = require('express-validator');

const actorRegisterValidator = [
    body('first_name')
        .notEmpty().withMessage('El campo no puede estar vacío').bail()
        .isLength({ min: 3, max: 10 }).withMessage('El campo debe tener entre 3 y 10 caracteres').bail(),

    body('last_name')
        .notEmpty().withMessage('El campo no puede estar vacío').bail()
        .isLength({ min: 3, max: 10 }).withMessage('El campo debe tener entre 3 y 10 caracteres').bail(),
];

module.exports = actorRegisterValidator;
