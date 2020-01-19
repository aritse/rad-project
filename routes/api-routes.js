// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Grabbing our models

var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the users
    app.get("/api/users", function (req, res) {
        db.User.findAll({}).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    // PUT route for updating users. The updated user will be available in req.body
    app.put("/api/users", function (req, res) {
        db.User.update({
            where: {
                user: req.body
            }
        }).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    // post for login, JWT Auth
    app.post("/login", function (req, res) {
        res.status(200).json({ Authtoken: '' });
    });

    // post for register, JWT Auth
    app.post("/register", function (req, res) {
        res.status(200).json({ Authtoken: '' });
    });
};
