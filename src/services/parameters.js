const {
    sequelize,
    Parametros: parameterModel,
    ValorParametros: valueParameterModel,
} = require("../models");

class parameterService {
    async getParameter(id) {
        const parameter = await parameterModel.findOne({
            where: { id, estado: 1 },
            include: [
                {
                    model: valueParameterModel,
                    as: "valoresParametros",
                    where: { estado: 1 },
                },
            ],
        });
        return parameter;
    }

    async getParameters(where) {
        const parameters = await parameterModel.findAll({
            where: { estado: 1, ...where },
            order: [["id", "DESC"]],
            include: [
                {
                    model: valueParameterModel,
                    as: "valoresParametros",
                    where: { estado: 1 },
                },
            ],
        });
        return parameters;
    }

    async createParameter(data) {
        const t = await sequelize.transaction();

        try {
            const { id: parameterId } = await parameterModel.create(
                { nombre_parametro: data.form.nombre_parametro },
                {
                    transaction: t,
                }
            );

            await Promise.all(
                data.parameters.map(async (item) => {
                    await valueParameterModel.create(
                        {
                            valor_parametro: item.valor_parametro,
                            orden: item.orden,
                            id_parametros: parameterId,
                        },
                        {
                            transaction: t,
                        }
                    );
                })
            );

            await t.commit();
            return parameterId;
        } catch (error) {
            await t.rollback();
            throw new Error(error);
        }
    }

    async updatedParameter(data, parameterId) {
        const t = await sequelize.transaction();

        try {
            await parameterModel.update(
                { nombre_parametro: data.form.nombre_parametro },
                {
                    where: { id: parameterId },
                    transaction: t,
                }
            );

            const currentParameters = await valueParameterModel.findAll({
                where: {
                    id_parametros: parameterId,
                    estado: 1,
                },
            });
            const idCurrentParameters = currentParameters.map((item) => {
                if (item.id) return item.id;
            });
            const idParameters = data.parameters.map((item) => {
                if (item.id) return item.id;
            });

            const deletedParameters = currentParameters.filter(
                (item) => !idParameters.includes(item.id)
            );
            const updatedParameters = data.parameters.filter((item) =>
                idCurrentParameters.includes(item.id)
            );
            const createdParameters = data.parameters.filter((item) => !item.id);

            await Promise.all(
                createdParameters.map(async (item) => {
                    await valueParameterModel.create(
                        {
                            valor_parametro: item.valor_parametro,
                            orden: item.orden,
                            id_parametros: parameterId,
                        },
                        {
                            transaction: t,
                        }
                    );
                })
            );

            await Promise.all(
                deletedParameters.map(async (parameter) => {
                    await valueParameterModel.update(
                        { estado: -1 },
                        {
                            where: { id: parameter.id },
                            transaction: t,
                        }
                    );
                })
            );

            await Promise.all(
                updatedParameters.map(async (parameter) => {
                    await valueParameterModel.update(
                        {
                            valor_parametro: parameter.valor_parametro,
                            orden: parameter.orden,
                        },
                        {
                            where: {
                                id: parameter.id,
                            },
                            transaction: t,
                        }
                    );
                })
            );

            await t.commit();
            return parameterId;
        } catch (error) {
            await t.rollback();
            throw new Error(error);
        }
    }

    async deleteParameter(parameterId, data) {
        const t = await sequelize.transaction();

        try {
            await parameterModel.update(
                { estado: -1 },
                {
                    where: { id: parameterId },
                    transaction: t,
                }
            );

            const deletedParameters = await valueParameterModel.findAll({
                where: {
                    id_parametros: parameterId,
                    estado: 1,
                },
            });

            await Promise.all(
                deletedParameters.map(async (parameter) => {
                    await valueParameterModel.update(
                        { estado: -1 },
                        {
                            where: { id: parameter.id },
                            transaction: t,
                        }
                    );
                })
            );

            await t.commit();
            return parameterId;
        } catch (error) {
            await t.rollback();
            throw new Error(error);
        }
    }
}

module.exports = parameterService;