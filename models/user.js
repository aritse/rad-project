module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  });

  return User;
};
