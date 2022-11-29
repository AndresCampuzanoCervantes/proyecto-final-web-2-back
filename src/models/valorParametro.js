"use strict";
module.exports = (sequelize, DataTypes) => {
    const ValorParametros = sequelize.define(
        "ValorParametros",
        {
            id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            valor_parametro: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            orden: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            estado: {
                type: DataTypes.TINYINT(4),
                allowNull: false,
                defaultValue: 1,
            },
            id_parametros: {
                type: DataTypes.BIGINT(20),
                allowNull: false,
            },
        },
        {
            tableName: "pw_valores_parametros",
            timestamps: false,
        }
    );

    ValorParametros.associate = function (models) {
        ValorParametros.belongsTo(models.Parametros, {
            foreignKey: "id_parametros",
            as: "parametros",
        });
    };

    return ValorParametros;
};