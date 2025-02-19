const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ActionItem extends Model {
        static associate(models) {
            ActionItem.belongsTo(models.Account, { foreignKey: 'accountId' });
        }
    }

    ActionItem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ActionItem'
    });

    return ActionItem;
}; 