// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Grabbing our models

var db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "h22@@i@!12hghh@#2jjekllsol";

// Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the users
    app.get("/api/handymans", function (req, res) {
        db.Handyman.findAll({}).then(function (dbHandyman) {
            res.json(dbHandyman);
        });
    });

    // GET Customer by ID
    app.get("/api/handymans/:id", (req, res) => {
        db.Handyman.findOne({ where: { id: req.params.id } })
            .then(function (dbHandyman) {
                res.status(200).json(dbHandyman);
            }).catch(err => {
                res.status(404).end();
            });
    });

    // This is Handyman updating their info
    // PUT route for updating users. The updated Handyman data will be available in req.body
    app.put("/api/handymans/:id", function (req, res) {
        db.Handyman.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function (dbHandyman) {
            res.json(dbHandyman);
        });
    });

    // post for Customer login, JWT Auth
    app.post("/handyman-login", function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        db.User.findOne({
            where: {
                username
            },
            include: [db.Handyman] // this might now work, we create user then create handyman, no auto Handyman association on User table
        }).then(function (user) {
            if (!user) return res.status(404).json("No user found");
            const result = bcrypt.compareSync(password, user.password);
            if (!result) return res.status(401).json("Password incorrect");

            db.Handyman.findOne({
                where: {
                    UserId: user.id
                }
            }).then(handyman => {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn });
                res.status(200).json({ user, handyman, "access_token": accessToken, "expires_in": expiresIn });
            })
        }).catch(err => {
            res.status(500).send(err.stack);
        });
    });

    // post for register, JWT Auth
    app.post("/handyman-register", function (req, res) {
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.password);
        const isAdmin = req.body.isAdmin || 1;

        db.User.create({ username, password, isAdmin }).then(function (dbUser) {
            const handyman = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                streetAddress: req.body.address,
                city: req.body.city,
                state: req.body.state,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                UserId: dbUser.id
            }

            db.Handyman.create(handyman).then(function (dbHandyman) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: dbUser.id }, SECRET_KEY, { expiresIn });
                res.status(200).json({ "user": dbUser, "handymanInfo": dbHandyman, "access_token": accessToken, "expires_in": expiresIn });
            }).catch(err => {
                res.status(500).json(err.stack);
            })
        }).catch(err => {
            res.status(500).json(err.stack);
        });
    });
};


