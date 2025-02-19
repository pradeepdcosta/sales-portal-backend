const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Opportunity extends Model {
        static associate(models) {
            Opportunity.belongsTo(models.Account, { foreignKey: 'accountId' });
        }
    }

    Opportunity.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expectedCloseDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Opportunity'
    });

    return Opportunity;
}; 