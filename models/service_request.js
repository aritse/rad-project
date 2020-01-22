module.exports = function(sequelize, DataTypes) {
  const ServiceRequest = sequelize.define("ServiceRequest", {
    status: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    numberOfHandyman: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    hoursToComplete: DataTypes.INTEGER
  });

  return ServiceRequest;
};
