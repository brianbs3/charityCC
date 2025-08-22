var Sequelize = require('sequelize');


module.exports = function (sequelize, DataTypes) {

    return sequelize.define('products', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        upc: { type: Sequelize.DOUBLE },
        description: { type: Sequelize.STRING },
        category: { type: Sequelize.STRING },
        img_url: { type: Sequelize.INTEGER },
        created: { type: Sequelize.TIME },
        updated: { type: Sequelize.TIME }
    },
        {
            tableName: 'products',
            underscored: true,
            freezeTableName: true,
            underscoredAll: true,
            timestamps: false

        });
}