const express = require('express');

const router = express.Router();

const moviesController = require('../../controllers/api/moviesController');
const movieValidator = require('../../validations/movieValidator');
const movieUpdateValidator = require('../../validations/movieUpdateValidator');
router.get('/movies', moviesController.list);
router.get('/movies/new', moviesController.new);
router.get('/movies/recommended', moviesController.recomended);
router.get('/movies/detail/:id', moviesController.detail);
router.get('/movies/search', moviesController.search)
//Rutas exigidas para la creación del CRUD
router.get('/movies/add', moviesController.add);


router.post('/movies/create',movieValidator, moviesController.create);
router.get('/movies/edit/:id', moviesController.edit);
router.put('/movies/update/:id',movieUpdateValidator, moviesController.update);
router.get('/movies/delete/:id', moviesController.delete);
router.delete('/movies/delete/:id', moviesController.destroy);

module.exports = router;