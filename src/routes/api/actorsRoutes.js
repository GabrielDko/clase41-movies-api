const express = require('express');
const router = express.Router();

const actorsController = require('../../controllers/api/actorsController');
const actorRegisterValidator = require('../../validations/actorRegisterValidator')

router

.get('/actors', actorsController.allActors)
.get('/actors/search', actorsController.search)
.get('/actor/detail/:id', actorsController.detail)

.post('/actor/create', actorRegisterValidator, actorsController.create)
.delete('/actor/delete/:id', actorsController.actorDelete)

module.exports = router;