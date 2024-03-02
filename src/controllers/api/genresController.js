const db = require("../../database/models");
const sequelize = db.sequelize;

const genresController = {
    list: async (req, res) => {
        try {
            const genres = await db.Genre.findAll();
            if (genres.length > 0) {
                return res.status(200).json({
                    meta: {
                        total: genres.length,
                        status: 200,
                        url: "/apiGenres/genres",
                    },
                    data: genres,
                });
            } else {
                throw new Error("No hay géneros");
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    },
    detail: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!Number.isInteger(id)) {
                throw new Error(`El id del género debe ser un número entero.`);
            } else {
                const genre = await db.Genre.findByPk(req.params.id);
                if (genre) {
                    return res.status(200).json({
                        meta: {
                            status: 200,
                            url: `/apiGenres/genres/detail/${req.params.id}`,
                        },
                        data: genre,
                    });
                } else {
                    throw new Error(`No existe el género con el ID ${req.params.id}.`);
                }
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    },
};

module.exports = genresController;
