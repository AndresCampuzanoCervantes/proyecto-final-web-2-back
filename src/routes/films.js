const expresss = require("express");
const FilmsService = require("../services/films");

const FilmsApi = (app) => {
    const router = expresss.Router();
    app.use("/movie", router);

    router.get("/:movieId", async function (req, res, next) {
        const { movieId } = req.params;
        try {
            const movie = await FilmsService.getMovie(movieId);

            res.status(200).json({
                movie,
                message: movie
                    ? "movie finded."
                    : "A movie with this Id wasn't found.",
            });
        } catch (err) {
            next(err);
        }
    });

    router.post("/getFilms", async function (req, res, next) {
        const { body: where } = req;
        try {
            const films = await FilmsService.getFilms(where);

            res.status(200).json({
                films,
                message:
                    films.length > 0
                        ? "listed films."
                        : "registers not finded.",
            });
        } catch (err) {
            next(err);
        }
    });

    router.post("/", async function (req, res, next) {
        const { body: data } = req;
        try {
            const movieCreated = await FilmsService.createMovie(data);
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
            const movieUpdated = await FilmsService.updateMovie(data, movieId);

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
            const userDeleted = await FilmsService.deleteMovie(movieId);

            res.status(200).json({
                movieId: userDeleted,
            });
        } catch (error) {
            next(error);
        }
    });

}

module.exports = FilmsApi;
