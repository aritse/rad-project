// HTML Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the todos
    app.get("/", function (req, res) {
        res.render("index");
    });

    // GET route for creating a login
    app.get("/register", function (req, res) {
        res.render("register");
    });


};
