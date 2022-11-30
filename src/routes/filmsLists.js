const expresss = require("express");
const filmsListsService = require("../services/filmsLists");

const filmsListsApi = (app) => {
    const router = expresss.Router();
    app.use("/films", router);

    router.post("/getFilms", async function (req, res, next) {
        const { body: where } = req;
        try {
            const films = await filmsListsService.getFilmsLists(where);

            res.status(200).json({
                films,
                message:
                    films.length > 0
                        ? "lists of films listed."
                        : "registers not finded.",
            });
        } catch (err) {
            next(err);
        }
    });

    router.post("/", async function (req, res, next) {
        const { body: data } = req;
        try {
            const movieCreated = await filmsListsService.createFilmsLists(data);
            res.status(201).json({
                movieCreated,
            });
        } catch (error) {
            next(error);
        }
    });

    router.put("/:movieId", async function (req, res, next) {
        const { body: data } = req;
        const { movieId } = req.params;

        try {
            const movieUpdated = await filmsListsService.updateFilmsLists(data, movieId);

            res.status(201).json({
                movieUpdated,
            });
        } catch (error) {
            next(error);
        }
    });

    router.delete("/:movieId", async function (req, res, next) {
        const { movieId } = req.params;

        try {
            const userDeleted = await filmsListsService.deleteFilmsLists(movieId);

            res.status(200).json({
                movieId: userDeleted,
            });
        } catch (error) {
            next(error);
        }
    });

}

module.exports = filmsListsApi;