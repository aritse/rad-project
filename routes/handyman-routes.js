// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Grabbing our models

var db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the users
    app.get("/api/handymans", function (req, res) {
        if (req.session.user) {
            req.session.error = "";
            req.session.statusCode = 200;

            db.Handyman.findAll({}).then(function (dbHandyman) {
                res.json(dbHandyman);
            });
        } else {
            req.session.user = false;
            req.session.error = "Not authenticated."
            req.session.statusCode = 401;
        }
    });

    // GET Customer by ID
    app.get("/api/handymans/:id", (req, res) => {
        db.HandyMan.findOne({ where: { id: req.params.id } })
            .then(function (dbHandyman) {
                res.status(200).json(dbHandyman);
            }).catch(err => {
                res.status(404).end();
            });
    });

    // This is Handyman updating their info
    // PUT route for updating users. The updated Handyman data will be available in req.body
    app.put("/api/handymans/:id", function (req, res) {
        db.HandyMan.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function (dbHandyman) {
            res.json(dbHandyman);
        });
    });

    // post for handyman login, JWT Auth
    app.post("/handyman-login", function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        db.User.findOne({
            where: {
                username
            },
            include: [db.HandyMan]
        }).then(function (user) {
            if (!user) {
                req.session.user = false;
                req.session.error = "No User Found";
                return res.status(404).json("No user found");
            }
            const result = bcrypt.compareSync(password, user.password);
            if (!result) return res.status(401).json("Username or Password incorrect");

            db.HandyMan.findOne({
                where: {
                    UserId: user.id
                }
            }).then(handyman => {
                if (!handyman) return res.status(404).json("No User Found");
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.SESSION_SECRET, { expiresIn });

                res.status(200).json({ handyman, "access_token": accessToken, "expires_in": expiresIn });
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
            const user = { id: dbUser.id, username: dbUser.username };
            const handyman = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                streetAddress: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                UserId: dbUser.id
            }

            db.HandyMan.create(handyman).then(function (dbHandyman) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });
                res.status(200).json({ user, "handymanInfo": dbHandyman, "access_token": accessToken, "expires_in": expiresIn });
            }).catch(err => {
                res.status(500).json(err.stack);
            })
        }).catch(err => {
            res.status(500).json(err.stack);
        });
    });
};


