const express = require('express');
const router = express.Router();
const genresController = require('../../controllers/api/genresController');

router

// Get genres list 
.get('/genres', genresController.list)


// Get genre detail

.get('/genres/detail/:id', genresController.detail)


module.exports = router;