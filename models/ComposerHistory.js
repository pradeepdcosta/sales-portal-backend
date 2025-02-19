const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ComposerHistory extends Model {
        static associate(models) {
            ComposerHistory.belongsTo(models.Account, { 
                foreignKey: 'accountId',
                onDelete: 'CASCADE'
            });
        }
    }

    ComposerHistory.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Accounts',
                key: 'id'
            }
        },
        composerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        achievements: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'ComposerHistory',
        timestamps: true
    });

    return ComposerHistory;
}; 