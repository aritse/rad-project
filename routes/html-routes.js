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


    app.get("/handyman-login", function (req, res) {
        res.render("handyman-login");
    });

    app.get("/handyman-register", function (req, res) {
        res.render("handyman-register");
    });

    app.get("/select-slot", function (req, res) {   
        res.render("service-selection");
    });

    app.get("/confirm", function (req, res) {
        res.render("confirm");
    });

};
