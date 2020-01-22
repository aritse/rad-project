module.exports = function(sequelize, DataTypes) {
  const ServiceMenu = sequelize.define("ServiceMenu", {
    title: DataTypes.STRING,
    manHour: DataTypes.INTEGER,
    numberOfHandyman: DataTypes.INTEGER
  });

  return ServiceMenu;
};
