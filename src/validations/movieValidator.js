const { body } = require('express-validator');
const db = require('../database/models');

module.exports = [
    body('title')
        .notEmpty().withMessage('Este campo no puede estar vacío').bail()
        .isLength({ min: 4, max: 50 }).withMessage('La cantidad mínima de caracteres es de 4 y la máxima de 50').bail()
        .custom(async (value) => {
            console.log(value);
            const movies = await db.Movie.findAll();
            const movie = movies.find((movie) => movie.title === value);
            console.log(movie);
            if (movie) {
                throw new Error('El nombre de la película ya está registrado.');
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
