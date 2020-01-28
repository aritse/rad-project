// HTML Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the todos
    app.get("/", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = false;
        res.render("index");
    });

    // GET route for creating a register
    app.get("/register", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = false;
        res.render("register");
    });

    // GET route for creating a register
    app.get("/login", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = false;
        res.render("login");
    });


    app.get("/handyman-login", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = false;
        res.render("handyman-login");
    });

    app.get("/handyman-register", function (req, res) {
        // reset session user
        req.session.user = false;
        req.session.error = "";
        req.session.isHandy = false;
        res.render("handyman-register");
    });

    app.get("/select-slot", function (req, res) {
        if (req.session.user) {
            res.render("service-selection");
        } else {
            res.render("login");
        }
    });

    app.get("/confirm", function (req, res) {
        if (req.session.user) {
            res.render("confirm");
        } else {
            res.render("login");
        }
    });

    app.get("/update-service", function (req, res) {
        if (req.session.user) {
            res.render("assignments")
        } else {
            res.render("login");
        }
    });

};
