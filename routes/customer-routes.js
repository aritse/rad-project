var db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Routes
// =============================================================
module.exports = function (app) {

    // update customer info view
    app.get("/customer-info", function (req, res) {
        // if (!req.session.user) {
        //     req.session.user = false;
        //     req.session.error = "No session, please login"
        //     return res.redirect("/");
        // } else {
        req.session.user = { id: 1, username: "Han2" }
        db.Customer.findOne({
            where: {
                UserId: req.session.user.id
            },
            include: [db.User]
        }).then(dbCustomer => {
            const customer = {
                id: dbCustomer.id,
                firstName: dbCustomer.firstName,
                lastName: dbCustomer.lastName,
                streetAddress: dbCustomer.streetAddress,
                city: dbCustomer.city,
                state: dbCustomer.state,
                zipCode: dbCustomer.zipCode,
                phoneNumber: dbCustomer.phoneNumber,
                email: dbCustomer.email,
                userId: dbCustomer.userId
            }
            res.render("customer-info", customer);
        });
        // }
    });

    /**
     * ROUTE - /api/customers
     * @description Get all customers
     */
    app.get("/api/customers", function (req, res) {
        db.Customer.findAll({}).then(function (dbUser) {
            res.json(dbUser);
        });
    });

    /**
     * ROUTE - /api/customers/:id
     * @description Get customer by ID
     * @expects id to be on req.params (url parameter)
     */
    app.get("/api/customers/:id", (req, res) => {
        db.Customer.update(req.body, { where: { id: req.params.id } })
            .then(function (dbCustomer) {
                res.status(200).json(dbCustomer);
            });
    });

    /**
     * ROUTE - /api/customers/:id
     * @description PUT route for updating users. The updated Customer data will be available in req.body
     */
    app.put("/api/customers/:id", function (req, res) {
        db.Customer.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function (dbCustomer) {
            res.json(dbCustomer);
        });
    });

    /**
     * ROUTE - /login
     * @description Customer Login
     * @expects User info on req.body, username & password
     * @returns Auth token, User and Customer info
     */
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
                req.session.user = user;
                req.session.error = "";
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });
                res.status(200).json({ user, customer, "access_token": accessToken, "expires_in": expiresIn });
            })
        }).catch(err => {
            req.session.user = false;
            req.session.error = "Failed creating customer";
            if (err.parent && err.parent.sqlMessage) {
                res.status(500).json(err.parent.sqlMessage);
            } else {
                res.status(500).json(err.stack);
            }
        });
    });

    /**
     * ROUTE - /register
     * @description Create new User and Customer
     * @expects User and Customer info in req.body
     * @returns Auth token, User and Customer info
     */
    app.post("/register", function (req, res) {
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.password);
        const isAdmin = req.body.isAdmin || 0;

        db.User.create({ username, password, isAdmin }).then(function (dbUser) {
            const user = { id: dbUser.id, username: dbUser.username };
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
                req.session.user = user;
                req.session.error = "";
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn });
                res.status(200).json({ user, "customerInfo": dbCustomer, "access_token": accessToken, "expires_in": expiresIn });
            }).catch(err => {
                req.session.user = false;
                req.session.error = "Failed creating customer";
                if (err.parent && err.parent.sqlMessage) {
                    res.status(500).json(err.parent.sqlMessage);
                } else {
                    res.status(500).json(err.stack);
                }
            })
        }).catch(err => {
            req.session.user = false;
            req.session.error = "Failed creating customer";
            if (err.parent && err.parent.sqlMessage) {
                res.status(500).json(err.parent.sqlMessage);
            } else {
                res.status(500).json(err.stack);
            }
        });
    });
};
