// // *********************************************************************************
// // api-routes.js - this file offers a set of routes for displaying and saving data to the db
// // *********************************************************************************

// // Dependencies
// // =============================================================

// // Grabbing our models

// var db = require("../models");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const SECRET_KEY = "hi12!@hghh@##2jjekllsol";

// // Routes
// // =============================================================
// module.exports = function (app) {

//     // GET route for getting all of the users
//     app.get("/api/users", function (req, res) {
//         db.User.findAll({}).then(function (dbUser) {
//             res.json(dbUser);
//         });
//     });

//     // GET Users by username
//     app.get("/api/users/:username", (req, res) => {
//         db.User.findOne({ where: { username: req.params.username } })
//             .then(function (dbUser) {
//                 res.status(200).json(dbUser);
//             });
//     });

//     // PUT route for updating users. The updated user will be available in req.body
//     app.put("/api/users", function (req, res) {
//         db.User.update({
//             where: {
//                 user: req.body
//             }
//         }).then(function (dbUser) {
//             res.json(dbUser);
//         });
//     });

//     // post for login, JWT Auth
//     app.post("/login", function (req, res) {
//         const username = req.body.username;
//         const password = req.body.password;

//         db.User.findOne({
//             where: {
//                 username
//             }
//         }).then(function (user) {
//             if (!user) return res.status(404).json("No user found");
//             const result = bcrypt.compareSync(password, user.password);
//             if (!result) return res.status(401).json("Password incorrect");

//             const expiresIn = 24 * 60 * 60;
//             const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn });
//             res.status(200).json({ user, "access_token": accessToken, "expires_in": expiresIn });
//         }).catch(err => {
//             res.status(500).send(err.stack);
//         });
//     });

//     // post for register, JWT Auth
//     app.post("/register", function (req, res) {
//         const username = req.body.username;
//         const password = bcrypt.hashSync(req.body.password);

//         db.User.create({ username, password }).then(function (dbUser) {
//             const expiresIn = 24 * 60 * 60;
//             const accessToken = jwt.sign({ id: dbUser.id }, SECRET_KEY, { expiresIn });
//             res.status(200).json({ "user": dbUser, "access_token": accessToken, "expires_in": expiresIn });
//         }).catch(err => {
//             res.status(500).json(err.stack);
//         });
//     });
// };
