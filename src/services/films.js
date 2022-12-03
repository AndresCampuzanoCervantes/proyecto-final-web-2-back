const {
    sequelize,
    Peliculas: filmsModel,
} = require("../models");

const getMovie = async (id) => {
    const movie = await filmsModel.findOne({
        where: {
            id,
            estado: 1,
        },
    });
    return movie;
}

const getFilms = async (where) => {
    const films = await filmsModel.findAll({
        where: { estado: 1, ...where },
        order: [["id", "DESC"]]
    });
    return films;
}

const createMovie = async (movieData) => {
    const t = await sequelize.transaction();

    try {
        let movieID = null;
        if (movieData.id_pelicula !== "") {
            movieID = await filmsModel.findOne({
                where: {
                    id_pelicula: movieData.id_pelicula,
                    id_lista_pelicula: movieData.id_lista_pelicula,
                    estado: 1,
                },
            });
        }

        if (!movieID) {
            const { id: newMovie } = await filmsModel.create(
                {
                    ...movieData,
                    view_ED_parametro:1
                },
                {
                    transaction: t,
                }
            );
            await t.commit();
            return {
                success: true,
                newMovie,
            };
        } else {
            await t.rollback();
            return {
                success: false,
                message: "the film is already registered in this list.",
            };
        }
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

const updateMovie = async (movieData, movieId) => {
    const t = await sequelize.transaction();

    try {
        const movie = await filmsModel.findOne({
            where: {
                id: movieId,
                estado: 1,
            },
        });

        if (movie) {
            await filmsModel.update(
                { ...movieData },
                {
                    where: {
                        id: movieId,
                    },
                    transaction: t,
                }
            );
            await t.commit();

            const movieUpdated = await filmsModel.findOne({
                where: { id: movieId, estado: 1 },
            });

            return {
                success: true,
                movieUpdated,
            };

        } else {
            return {
                success: false,
                message: "the film is not registered in this list.",
            };
        }
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

const deleteMovie = async (movieId) => {
    const t = await sequelize.transaction();

    try {
        await filmsModel.update(
            {
                estado: -1,
            },
            {
                where: {
                    id: movieId,
                },
                transaction: t,
            }
        );

        await t.commit();
        return { success: true, movieId };
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

module.exports = {
    getMovie,
    getFilms,
    createMovie,
    updateMovie,
    deleteMovie,
};