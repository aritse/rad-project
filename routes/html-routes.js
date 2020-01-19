// HTML Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the todos
    app.get("/", function (req, res) {
        res.render("index");
    });


};
