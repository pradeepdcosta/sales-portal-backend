const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class AccountSection extends Model {
        static associate(models) {
            AccountSection.belongsTo(models.Account, {
                foreignKey: 'accountId',
                onDelete: 'CASCADE'
            });
        }
    }

    AccountSection.init({
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
        sectionType: {
            type: DataTypes.ENUM('executive_summary', 'customer_overview', 'account_overview', 'relationship_map'),
            allowNull: false
        },
        content: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        },
        lastModifiedBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        lastModifiedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'AccountSection',
        timestamps: true
    });

    return AccountSection;
}; 