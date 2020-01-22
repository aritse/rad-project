module.exports = function(sequelize, DataTypes) {
  const HandyMan = sequelize.define("HandyMan", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    employeeId: DataTypes.INTEGER
  });

  return HandyMan;
};
