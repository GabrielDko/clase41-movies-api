const express = require('express');
const router = express.Router();

const actorsController = require('../../controllers/api/actorsController');
const actorValidator = require('../../validations/actorValidator')

router

.get('/actors', actorsController.allActors)
.get('/actors/search', actorsController.search)
.get('/actor/detail/:id', actorsController.detail)

.post('/actor/create', actorValidator, actorsController.create)
.put('/actor/update/:id', actorValidator, actorsController.update)
.delete('/actor/delete/:id', actorsController.actorDelete)

module.exports = router;