"use strict";
module.exports = (sequelize, DataTypes) => {
    const Parametros = sequelize.define(
        "Parametros",
        {
            id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            nombre_parametro: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            estado: {
                type: DataTypes.TINYINT(4),
                defaultValue: 1,
            },
        },
        {
            tableName: "pw_parametros",
            timestamps: false,
        }
    );

    Parametros.associate = function (models) {
        Parametros.hasMany(models.ValorParametros, {
            foreignKey: "id_parametros",
            as: "valoresParametros",
        });
    };

    return Parametros;
};