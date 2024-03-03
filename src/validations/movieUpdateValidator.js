const { body } = require('express-validator');
const db = require('../database/models');

module.exports = [
    body('title')
        .notEmpty().withMessage('El título no puede estar vacío')
        .custom(async (value, { req }) => {
        const { id } = req.params;
        const existingMovie = await db.Movie.findOne({ where: { title: value } });
        if (existingMovie && existingMovie.id != id) {
            throw new Error('El título de la película ya está siendo utilizado por otra película');
        }
    }),
    body('rating')
        .notEmpty().withMessage('Este campo no puede estar vacío').bail()
        .isDecimal().withMessage('El rating debe ser un número decimal.'),
    body('awards')
        .notEmpty().withMessage('Este campo no puede estar vacío').bail()
        .isInt().withMessage('El número de premios debe ser un número entero.'),
    body('release_date')
        .notEmpty().withMessage('Este campo no puede estar vacío')
        .isISO8601().withMessage('El formato de fecha y hora es inválido'),
    body('genre_id')
        .optional()
        .isInt().withMessage('El género debe ser un número entero.'),
    body('length')
        .optional()
        .isInt().withMessage('La duración debe ser un número entero.'),
];
