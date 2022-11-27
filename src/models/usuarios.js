"use strict";
module.exports = (sequelize, DataTypes) => {
    const Usuarios = sequelize.define(
        "Usuarios",
        {
            id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            documento: {
                type: DataTypes.STRING(500),
            },
            nombres: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            apellidos: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            telefono: {
                type: DataTypes.STRING(500),
            },
            password: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            estado: {
                type: DataTypes.TINYINT(4),
                defaultValue: 1,
                allowNull: false,
            },
        },
        {
            tableName: "pw_usuarios",
            timestamps: false,
        }
    );

    return Usuarios;
};