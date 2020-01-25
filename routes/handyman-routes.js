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
        console.log("handyman login");
        console.log(username);
        console.log(password);

        db.User.findOne({
            where: {
                username:username
            }
        }).then(function (dbUser) {
            if (!dbUser) {
                req.session.user = false;
                req.session.error = "No User Found";
                return res.status(404).json("No user found");
            }
            console.log(dbUser);
            
            const result = bcrypt.compareSync(password, dbUser.password);
            if (!result) return res.status(401).json("Username or Password incorrect");

            db.HandyMan.findOne({
                where: {
                    UserId: dbUser.id
                }
            }).then(handyman => {
                if (!handyman) {
                    req.session.user = false;
                    req.session.error = "No User Found";
                    return res.status(404).json("No User Found");
                }
                console.log("HandyMan", handyman);
                
                const user = { id: handyman.id, username: handyman.username };
                req.session.user = user;
                req.session.error = "";
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });

                res.status(200).json({ user: user, handyman, "access_token": accessToken, "expires_in": expiresIn });
            })
        }).catch(err => {
            req.session.user = false;
            req.session.error = "Failed creating handyman";
            if (err.parent && err.parent.sqlMessage) {
                return res.status(500).json(err.parent.sqlMessage);
            } else {
                return res.status(500).json(err.stack);
            }
        });
    });

    /**
     * ROUTE: /handyman-register
     * @description POST request for creating a new Handyman User
     * @accepts User and Handyman information over req.body
     */
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
                zipCode: req.body.zipcode,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                UserId: dbUser.id
            }

            db.HandyMan.create(handyman).then(function (dbHandyman) {
                req.session.user = user;
                req.session.error = "";
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });
                res.status(200).json({ user, "handymanInfo": dbHandyman, "access_token": accessToken, "expires_in": expiresIn });
            }).catch(err => {
                req.session.user = false;
                req.session.error = "Failed creating handyman";
                res.status(500).json(err.stack);
            })
        }).catch(err => {
            req.session.user = false;
            req.session.error = "Failed creating User prior to handyman";
            res.status(500).json(err.parent.sqlMessage);
        });
    });
};


