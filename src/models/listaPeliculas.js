"use strict";
module.exports = (sequelize, DataTypes) => {
    const ListaPeliculas = sequelize.define(
        "ListasPeliculas",
        {
            id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            id_usuario: {
                type: DataTypes.BIGINT(20),
                allowNull: false,
            },
            nombre: {
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
            tableName: "pw_lista_peliculas",
            timestamps: false,
        }
    );

    ListaPeliculas.associate = function (models) {
        ListaPeliculas.belongsTo(models.Usuarios, {
            foreignKey: "id_usuario",
            as: "Usuarios",
        });
        ListaPeliculas.hasMany(models.Peliculas, {
            foreignKey: "id_lista_pelicula",
            as: "Peliculas",
        });
    };

    return ListaPeliculas;
};