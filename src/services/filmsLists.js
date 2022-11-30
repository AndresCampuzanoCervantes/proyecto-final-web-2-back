const {
    sequelize,
    ListaPeliculas: filmsListsModel,
} = require("../models");
const { createMovie } = require("./films");

const getFilmsLists = async (where) => {
    const films = await filmsListsModel.findAll({
        where: { estado: 1, ...where },
        order: [["id", "DESC"]]
    });
    return films;
}

const createFilmsLists = async (filmsListsData) => {
    const t = await sequelize.transaction();

    try {
        let filmsListsID = null;
        let movieList = [];
        if (filmsListsData.nombre !== "") {
            filmsListsID = await filmsListsModel.findOne({
                where: {
                    id_usuario: filmsListsData.id_usuario,
                    nombre: filmsListsData.nombre,
                    estado: 1,
                },
            });
        }

        if (filmsListsData.movieList.length > 0) {
            delete filmsListsData.movieList;
        }

        if (!filmsListsID) {
            const { id: newMovie } = await filmsListsModel.create(
                {
                    ...filmsListsData
                },
                {
                    transaction: t,
                }
            );
            await t.commit();

            if (movieList.length > 0) {
                await Promise.all(
                    movieList.map(async (e) => {
                        let current = {
                            estado: 1,
                            id_lista_pelicula: newMovie,
                            id_pelicula: e.id_pelicula,
                            path_imagen: e.path_imagen,
                            sinopsis: e.sinopsis,
                            fecha_lanzamiento: e.fecha_lanzamiento,
                            view_ED_parametro: 1,
                        };
                        return createMovie(
                            current,
                            {
                                transaction: t,
                            }
                        );
                    })
                )
            }
            return {
                success: true,
                newMovie,
            };
        } else {
            await t.rollback();
            return {
                success: false,
                message: "la pelicula ya se encuentra registrada en esta lista.",
            };
        }
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

const updateFilmsLists = async (movieData, movieId) => {
    const t = await sequelize.transaction();

    try {
        const movie = await filmsListsModel.findOne({
            where: {
                id: movieId,
                estado: 1,
            },
        });

        if (movie) {
            await filmsListsModel.update(
                { ...movieData },
                {
                    where: {
                        id: userId,
                    },
                    transaction: t,
                }
            );
            await t.commit();

            const movieUpdated = await filmsListsModel.findOne({
                where: { id: userId, estado: 1 },
            });

            return {
                success: true,
                movieUpdated,
            };

        } else {
            return {
                success: false,
                message: "la pelicula no se encuentra registrada en esta lista.",
            };
        }
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

const deleteFilmsLists = async (movieId) => {
    const t = await sequelize.transaction();

    try {
        await filmsListsModel.update(
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
    getFilmsLists,
    createFilmsLists,
    updateFilmsLists,
    deleteFilmsLists,
};