const path = require("path");
const db = require("../../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require("moment");
const { error } = require("console");
const { validationResult } = require("express-validator");

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const moviesController = {
    list: async (req, res) => {
        try {
            const movies = await db.Movie.findAll({ include: ["genre"] })
            if (movies.length > 0) {
                return res.status(200).json({
                    meta: {
                        status: 200,
                        total: movies.length,
                        url: "http://localhost:3000/api/movies",
                    },
                    data: movies,
                });
            } else {
                throw new Error("No existen peliculas");
            }
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    detail: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!Number.isInteger(id)) {
                throw new Error('El ID indicado debe ser un número entero.')
            } else {
                const movie = await db.Movie.findByPk(req.params.id, { include: ["genre"] });
                if (!movie) {
                    throw new Error(`La pelicula con el ID ${id} no existe.`)
                } else {
                    return res.status(200).json({
                        meta: {
                            status: 200,
                            url: `http://localhost:3000/api/movies/detail/${id}`,
                        },
                        data: movie,
                    });
                }
            }
        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
    new: async (req, res) => {
        try {
            const movies = await db.Movie.findAll({
                order: [["release_date", "DESC"]],
                limit: 5,
            })
            if (!movies.length > 0) {
                throw new Error('No existen peliculas')
            } else {
                return res.json({
                    meta: {
                        status: 200,
                        url: "http://localhost:3000/api/movies/new",
                    },
                    data: movies,
                });
            }
        } catch (error) {
            return res.status(400).json(error.message);
        }
    },
    recomended: async (req, res) => {
        try {
            const movies = await db.Movie.findAll({
                include: ["genre"],
                where: {
                    rating: { [db.Sequelize.Op.gte]: 8 },
                },
                order: [["rating", "DESC"]]
            })
            if (!movies.length > 0) {
                throw new Error('No existen peliculas.')
            } else {
                return res.json({
                    meta: {
                        status: 200,
                        total: movies.length,
                        url: "http://localhost:3000/api/movies/recommended",
                    },
                    data: movies,
                });
            }
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    search: async (req, res) => {
        try {
            const { keyword } = req.query;
            const movies = await db.Movie.findAll({
                include: ["genre"],
                where: {
                    title: { [Op.like]: `%${keyword}%` },
                },
            })

            if (!movies.length > 0) {
                throw new Error(`No hubo coincidencias con ${keyword}.`)
            } else {
                return res.status(200).json(movies);
            }
        } catch (error) {
            return res.status(400).json(error.message)
        }
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: async (req, res) => {
        try {
            const allGenres = await Genres.findAll();
            const allActors = await Actors.findAll();
    
            res.render(path.resolve(__dirname, '..', 'views', 'moviesAdd'), {
                allGenres,
                allActors,
            });
        } catch (error) {
            res.send(error);
        }
    },    
    create: async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                const mappedErrors = errors.mapped()
                for (const key in mappedErrors) {
                    delete mappedErrors[key].type;
                    delete mappedErrors[key].location;
                    delete mappedErrors[key].path;
                }
                const jsonError = JSON.stringify(mappedErrors);
                throw new Error (jsonError)
            } else {

            const movie = await db.Movie.create(req.body)
            return res.status(200).json({
                data: movie,
                status: 200,
                created: "ok",
            });
            }
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    edit: function (req, res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId, { include: ["genre", "actors"] });
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise.all([promMovies, promGenres, promActors])
            .then(([Movie, allGenres, allActors]) => {
                Movie.release_date = moment(Movie.release_date).format("L");
                return res.render(
                    path.resolve(__dirname, "..", "views", "moviesEdit"),
                    { Movie, allGenres, allActors }
                );
            })
            .catch((error) => res.send(error));
    },
    update: async (req, res) => {
        try {
            const errors = validationResult(req)
            const id = parseInt(req.params.id);
            if(!Number.isInteger(id)){
                throw new Error('El ID indicado debe ser un número entero.')
            }

            if(!errors.isEmpty()){
                const mappedErrors = errors.mapped()
                for (const key in mappedErrors) {
                    delete mappedErrors[key].type;
                    delete mappedErrors[key].location;
                    delete mappedErrors[key].path;
                }
                const jsonError = JSON.stringify(mappedErrors);
                throw new Error (jsonError)
            } else {
            const movie = await db.Movie.findByPk(id)
            await movie.update(req.body)
            return res.status(200).json({
                data: movie,
                status: 200,
                created: "ok",
            });
            }
        } catch (error) {
            return res.status(400).send(error.message)
        }
    },
    delete: function (req, res) {
        let movieId = req.params.id;
        db.Movie.findByPk(movieId)
            .then((Movie) => {
                return res.render(
                    path.resolve(__dirname, "..", "views", "moviesDelete"),
                    { Movie }
                );
            })
            .catch((error) => res.send(error));
    },
    destroy: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if(!Number.isInteger(id)){
                throw new Error('El ID indicado debe ser un número entero.')
            }
            const movie = await db.Movie.findByPk(id)
            if(!movie){
                throw new Error(`La pelicula con el ID ${id} no existe.`)
            } else {
                await movie.destroy({
                    where: { id: req.params.id },
                    force: true,
                }) // force: true es para asegurar que se ejecute la acción
                        return res.json({
                            deleted: "ok",
                        });
            }
        } catch (error) {
            console.log(error.message);
            return res.status(400).json(error.message)
        }
    },
};

module.exports = moviesController;
