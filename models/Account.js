const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Account extends Model {
        static associate(models) {
            Account.hasMany(models.Opportunity, { foreignKey: 'accountId' });
            Account.hasMany(models.KeyContact, { foreignKey: 'accountId' });
            Account.hasMany(models.ActionItem, { foreignKey: 'accountId' });
            Account.belongsToMany(models.User, {
                through: 'UserAccounts',
                as: 'users',
                foreignKey: 'accountId'
            });
        }
    }

    Account.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        accountId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        overview: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        strategy: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        executiveSummary: {
            type: DataTypes.TEXT
        },
        managementSummary: {
            type: DataTypes.TEXT
        },
        accountVision: {
            type: DataTypes.TEXT
        },
        executiveSponsor: {
            type: DataTypes.TEXT
        },
        keyAccountInfo: {
            type: DataTypes.TEXT
        },
        priorityOpportunities: {
            type: DataTypes.TEXT
        },
        businessOverview: {
            type: DataTypes.TEXT
        },
        businessStrategy: {
            type: DataTypes.TEXT
        },
        marketDrivers: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Account'
    });

    return Account;
}; 