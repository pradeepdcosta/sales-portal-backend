module.exports = (models) => {
  const { User, Account } = models;

  // Many-to-Many relationship between Users and Accounts for management
  User.belongsToMany(Account, {
    through: 'UserManagedAccounts',
    as: 'managedAccounts',
    foreignKey: 'userId'
  });

  Account.belongsToMany(User, {
    through: 'UserManagedAccounts',
    as: 'accountManagers',
    foreignKey: 'accountId'
  });
}; 