const path = require('path');
const sequelize = require('../config/database');
const User = require(path.join(__dirname, 'User'))(sequelize);
const Account = require(path.join(__dirname, 'Account'))(sequelize);
const Opportunity = require(path.join(__dirname, 'Opportunity'))(sequelize);
const KeyContact = require(path.join(__dirname, 'KeyContact'))(sequelize);
const ActionItem = require(path.join(__dirname, 'ActionItem'))(sequelize);
const AccountSection = require(path.join(__dirname, 'AccountSection'))(sequelize);

const models = {
    User,
    Account,
    Opportunity,
    KeyContact,
    ActionItem,
    AccountSection
};

// Run associations
Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

module.exports = models; 