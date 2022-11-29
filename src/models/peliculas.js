
"use strict";
module.exports = (sequelize, DataTypes) => {
    const Peliculas = sequelize.define(
        "Peliculas",
        {
            id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                autoIncrement: true,
            },
            id_lista_pelicula: {
                type: DataTypes.BIGINT(20),
                allowNull: false,
            },
            id_pelicula:{
                type: DataTypes.BIGINT(20),
                allowNull: false,
            },
            nombre: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            path_imagen: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            sinopsis :{
                type: DataTypes.TEXT,
                allowNull: true,
            },
            fecha_lanzamiento :{
                type: DataTypes.DATE,
                allowNull: false,
            },
            view_ED_parametro:{
                type: DataTypes.BIGINT(20),
                allowNull: false,
            },
            estado: {
                type: DataTypes.TINYINT(4),
                defaultValue: 1,
                allowNull: false,
            },
        },
        {
            tableName: "pw_peliculas",
            timestamps: false,
        }
    );

    Peliculas.associate = function (models) {
        Peliculas.belongsTo(models.ListasPeliculas, {
            foreignKey: "id_lista_pelicula",
            as: "ListasPeliculas",
        });
    };

    return Peliculas;
};