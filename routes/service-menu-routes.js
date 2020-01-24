var db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = function(app) {
  app.post("/api/menu", function(req, res) {
    db.ServiceMenu.create(req.body).then(function(dbServiceMenu) {
      console.log("======================================",dbServiceMenu);
      
      res.render("service-menu", {servicemenus:dbServiceMenu});
    });
  });
  app.get("/api/menu", function(req, res) {
    db.ServiceMenu.findAll({raw:true}).then(function(dbServiceMenu) {
      console.log(dbServiceMenu);
      
      res.render("service-menu", {servicemenus:dbServiceMenu});
    }).catch(err => console.log(err));
  });
  app.get("/api/menu/title", function(req, res) {
    db.ServiceMenu.findAll({
      where: {
        title: {
          [Op.like]: "%" + req.body.title + "%"
        }
      }
    }).then(function(dbServiceMenu) {
      res.json(dbServiceMenu);
    });
  });
  app.put("/api/menu/:id", function(req, res) {
    db.ServiceMenu.update(req.body, {
      where: { id: req.params.id }
    }).then(function(dbServiceMenu) {
      res.json(dbServiceMenu);
    });
  });
  app.delete("/api/menu/:id", function(req, res) {
    db.ServiceMenu.destroy({ where: { id: req.params.id } }).then(function(dbServiceMenu) {
      res.render("service-menu",dbServiceMenu);
    });
  });
};
