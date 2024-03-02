const db = require('../../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': (req, res) => {
        db.Genre.findAll()
            .then(genres => {
                return res.status(200).json({
                    meta: {
                        total: genres.length,
                        status: 200,
                        url: "/apiGenres/genres"
                    },
                    data: genres,
                })
            })
            .catch(err => console.log(err))
    },
    'detail': (req, res) => {
        db.Genre.findByPk(req.params.id)
            .then(genre => {
               if(genre){
                return res.status(200).json({
                    meta: {
                        status: 200,
                        url: `/apiGenres/genres/detail/${req.params.id}`
                    },
                    data: genre
                })
               } else {
                return res.json("No encontramos el género")
               }
            })
            .catch(err => console.log(err))
    }

}

module.exports = genresController;