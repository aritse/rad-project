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
    app.get("/api/customers", function (req, res) {
        db.Customer.findAll({}).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    // GET Customer by ID
    app.get("/api/customers/:id", (req, res) => {
        db.Customer.findOne({ where: { id: req.params.id } })
            .then(function (dbCustomer) {
                res.status(200).json(dbCustomer);
            });
    });

    // This is Customer updating their info
    // PUT route for updating users. The updated Customer data will be available in req.body
    app.put("/api/customers/:id", function (req, res) {
        db.Customer.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function (dbCustomer) {
            res.json(dbCustomer);
        });
    });

    // post for Customer login, JWT Auth
    app.post("/login", function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        db.User.findOne({
            where: {
                username
            }
        }).then(function (dbUser) {
            if (!dbUser) return res.status(404).json("No user found");
            const result = bcrypt.compareSync(password, dbUser.password);
            if (!result) return res.status(401).json("Password incorrect");

            db.Customer.findOne({
                where: {
                    UserId: dbUser.id
                }
            }).then(customer => {
                if (!customer) return res.status(404).json("No User Found");
                const user = { id: dbUser.id, username: dbUser.username };
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });
                res.status(200).json({ user, customer, "access_token": accessToken, "expires_in": expiresIn });
            })
        }).catch(err => {
            res.status(500).send(err.stack);
        });
    });

    // post for register, JWT Auth
    app.post("/register", function (req, res) {
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.password);
        const isAdmin = req.body.isAdmin || 0;

        db.User.create({ username, password, isAdmin }).then(function (dbUser) {
            const customer = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                streetAddress: req.body.address,
                city: req.body.city,
                state: req.body.state,
                email: req.body.email,
                zipCode: req.body.zipcode,
                phoneNumber: req.body.phoneNumber,
                UserId: dbUser.id
            }

            db.Customer.create(customer).then(function (dbCustomer) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: dbUser.id }, process.env.SESSION_SECRET, { expiresIn });
                res.status(200).json({ "user": dbUser, "customerInfo": dbCustomer, "access_token": accessToken, "expires_in": expiresIn });
            }).catch(err => {
                res.status(500).json(err.stack);
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json(err.stack);
        });
    });
};
