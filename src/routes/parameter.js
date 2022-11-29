const expresss = require("express");
const ParameterService = require("../services/parameters");

function ParameterApi(app) {
    const router = expresss.Router();
    app.use("/parameter", router);

    const parameterService = new ParameterService();

    router.get("/:parameterId", async function (req, res, next) {
        const { parameterId } = req.params;

        try {
            const parameter = await parameterService.getParameter(parameterId);

            res.status(200).json({
                parameter,
                message: parameter
                    ? "Parámetro encontrado"
                    : "No se encontró ningún parámetro con ese ID",
            });
        } catch (err) {
            next(err);
        }
    });

    router.post(
        "/getParameters",
        async function (req, res, next) {
            const { body: where } = req;
            try {
                const parameters = await parameterService.getParameters(where);

                res.status(200).json({
                    parameters,
                    message:
                        parameters.length > 0
                            ? "Parámetros listados"
                            : "No se encontraron registros",
                });
            } catch (err) {
                next(err);
            }
        }
    );

    router.post("/", async function (req, res, next) {
        const { body: data } = req;
        try {
            const created = await parameterService.createParameter(data);

            res.status(201).json({ created });
        } catch (error) {
            next(error);
        }
    });

    router.put("/:parameterId",  async function (req, res, next) {
        const { body: data } = req;
        const { parameterId } = req.params;
        try {
            const updated = await parameterService.updatedParameter(
                data,
                parameterId
            );

            res.status(201).json({ updated });
        } catch (error) {
            next(error);
        }
    });

    router.delete(
        "/:parameterId",
        async function (req, res, next) {
            const { parameterId } = req.params;
            const { body: data } = req;

            try {
                const deleted = await parameterService.deleteParameter(
                    parameterId,
                    data
                );

                res.status(200).json({ deleted });
            } catch (error) {
                next(error);
            }
        }
    );
}

module.exports = ParameterApi;