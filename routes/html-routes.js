// HTML Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the todos
    app.get("/", function (req, res) {
        res.render("index");
    });

    // GET route for creating a register
    app.get("/register", function (req, res) {
        res.render("register");
    });

    // GET route for creating a register
    app.get("/login", function (req, res) {
        res.render("login");
    });


};
