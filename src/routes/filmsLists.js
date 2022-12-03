const expresss = require("express");
const filmsListsService = require("../services/filmsLists");

const FilmsListsApi = (app) => {
    const router = expresss.Router();
    app.use("/films", router);

    router.get("/getFilms", async function (req, res, next) {
        try {
            const films = await filmsListsService.getFilmsLists();

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

    router.delete("/:filmsList", async function (req, res, next) {
        const { filmsList } = req.params;

        try {
            const filmsDeleted = await filmsListsService.deleteFilmsLists(filmsList);

            res.status(200).json({
                movieId: filmsDeleted,
            });
        } catch (error) {
            next(error);
        }
    });

}

module.exports = FilmsListsApi;