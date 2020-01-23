// HTML Routes
// =============================================================

const db = require("../models");
module.exports = function (app) {

    // GET route for getting all of the todos
    app.get("/", function (req, res) {
        res.render("index");
    });

    // GET route for creating a login
    app.get("/register", function (req, res) {
        res.render("register");
    });
            //this is covered in service-menu-routes
    // app.get("/service-menu", function (req, res){
    //     db.ServiceMenu.findAll({raw:true}).then(function(data) {
    //         console.log(data);
    //         var datObject = {
    //             servicemenus: data
    //         };
    //         res.render("service-menu", datObject);
    //       })
    //       .catch(err => console.log(err));
    // })
};
