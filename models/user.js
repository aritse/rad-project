module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  });

  User.associate = function (models) {
    User.hasOne(models.HandyMan, {
      allowNull: true
    });

    User.hasOne(models.Customer, { allowNull: true });
  }

  return User;
};
