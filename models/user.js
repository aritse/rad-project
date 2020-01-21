module.exports = function (sqlize, DataTypes) {
    return sqlize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.STRING
    });
}