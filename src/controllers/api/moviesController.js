const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { error } = require('console');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
               if(movies.length > 0){
                return res.json({
                    meta: {
                        status: 200,
                        total: movies.length,
                        url: '/apiMovies/movies'
                    },
                    data: movies
                   })
               } else {
                return res.json("No hay peliculas")
               }
            })
            .catch(err => console.log(err))
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include : ['genre']
            })
            .then(movie => {
                if(movie){
                    return res.status(200).json({
                        meta: {
                            status: 200,
                            url: `/apiMovies/movies/detail/${req.params.id}`
                        },
                        data: movie
                    })
                } else {
                    return res.json("No existe esa pelicula")
                }
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
               if(movies.length > 0){
                    return res.json({
                        meta: {
                            status: 200,
                            url: "/apiMovies/movies/new"
                        },
                        data: movies
                    })
               } else {
                return res.json("No hay peliculas")
               }
            })
            .catch(err => console.log(err))
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                if(movies.length > 0){
                    return res.json({
                        meta: {
                            status: 200,
                            total: movies.length,
                            url: '/apiMovies/movies/recommended'
                        },
                        data: movies
                       })
                   } else {
                    return res.json("No hay peliculas")
                   }
            });
    },search: (req,res)=>{
        db.Movie.findAll({
            include: ['genre'],
            where: {
                title: {[Op.like]: `%${req.query.keyword}%` }
            }
        })
            .then((movies)=>{
                if(movies.length > 0){
                    return res.status(200).json(movies)
                } else {
                    return res.json(`No hubo coincidencias con ${req.query.keyword}.`)
                }
            })
        .catch(err => err)
      },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        
        Promise
        .all([promGenres, promActors])
        .then(([allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {allGenres,allActors})})
        .catch(error => res.send(error))
    },
    create: (req,res) => {
        console.log("body: ",req.body);
        db.Movie.create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id,
            }
        )
        .then((movie)=> {
            return res.status(200).json({
                data: movie,
                status: 200,
                created: 'ok'
            })
        })            
        .catch(error => res.send(error))
    },
    edit: function(req,res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId,{include: ['genre','actors']});
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promMovies, promGenres, promActors])
        .then(([Movie, allGenres, allActors]) => {
            Movie.release_date = moment(Movie.release_date).format('L');
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres,allActors})})
        .catch(error => res.send(error))
    },
    update: function (req,res) {
        let movieId = req.params.id;
        db.Movie
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    delete: function (req,res) {
        let movieId = req.params.id;
        db.Movie
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesDelete'), {Movie})
        })
        .catch(error => res.send(error))
    },
    destroy: function (req,res) {
        let movieId = req.params.id;
        db.Movie
        .destroy({
            where: {id: movieId}, force: true
        }) // force: true es para asegurar que se ejecute la acción
        .then((movie)=>{
            return res.json({
                deleted: "ok"
            })
        })
        .catch(error => res.send(error)) 
    }
}

module.exports = moviesController;