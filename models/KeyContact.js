const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class KeyContact extends Model {
        static associate(models) {
            KeyContact.belongsTo(models.Account, { foreignKey: 'accountId' });
        }
    }

    KeyContact.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'KeyContact'
    });

    return KeyContact;
}; 