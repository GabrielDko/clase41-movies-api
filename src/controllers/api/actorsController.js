const { validationResult } = require('express-validator');
const db = require('../../database/models');
const { Op } = require('sequelize')


const actorsController = {
    allActors: async (req, res) => {
        try {
            const actors = await db.Actor.findAll();
            if (!actors.length > 0) {
                throw new Error('No existen actores')
            } else {
                return res.status(200).json(actors)
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    search: async (req, res) => {
        try {
            const actors = await db.Actor.findAll({
                where: {
                    first_name: { [Op.like]: `%${req.query.keyword}%` }
                },
                order: [['rating', 'DESC']]
            });
            if (!actors) {
                throw new Error(`No encontramos una coincidencia con ${req.query.keyword}`)
            } else {
                return res.status(200).json(actors);
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    detail: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!Number.isInteger(id)) {
                throw new Error(`El id indicado debe ser un número entero.`)
            }
            const actor = await db.Actor.findByPk(id, {
                include: ['movies', 'favorite_movie']
            })
            if (!actor) {
                throw new Error(`El actor con el ID ${id} no existe.`)
            } else {
                return res.status(200).json(actor)
            }
        } catch (error) {
            return res.status(400).json(error)
        }
    },
    create: async (req, res) => {
        try {
            const errors = validationResult(req)
            console.log(errors);
            if (!errors.isEmpty()) {
                const mappedError = errors.mapped();
                for (const key in mappedError) {
                    delete mappedError[key].type;
                    delete mappedError[key].location;
                    delete mappedError[key].path;
                }
                const jsonError = JSON.stringify(mappedError);
                throw new Error(jsonError)
            } else {
                const actor = await db.Actor.create(req.body);
                return res.status(200).send(actor);
            }
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    update: async (req,res)=>{
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                const mappedError = errors.mapped();
                for (const key in mappedError) {
                    delete mappedError[key].type;
                    delete mappedError[key].location;
                    delete mappedError[key].path;
                }
                const jsonError = JSON.stringify(mappedError);
                console.log(jsonError);
                throw new Error(jsonError)
            } else {
                const id = parseInt(req.params.id);
            if(!Number.isInteger(id)){
                throw new Error('El id indicado debe ser un número entero');
            } else {
                const actor = await db.Actor.findByPk(id);
                if(!actor){
                    throw new Error(`El actor con el ID ${id} no existe.`)
                } else {
                    await actor.update(req.body)
                    return res.status(200).json({
                        actor,
                        update: 'ok'
                    })
                }
            }
            }
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    actorDelete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            if (!Number.isInteger(id)) {
                throw new Error(`El ID indicado debe ser un numero entero`);
            }

            const actor = await db.Actor.findByPk(id);

            if (!actor) {
                throw new Error(`No existe un actor con el ID ${id} indicado`);
            }

            await actor.destroy();

            res.status(200).send(`El actor id ${id} fue eliminado`)
        } catch (error) {
            return res.status(400).send(error.message)
        }
    }

}


module.exports = actorsController;