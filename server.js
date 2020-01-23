const express = require("express");
const hbs = require("express-handlebars");
const app = express();
const PORT = process.env.PORT || 3300;
const db = require("./models");

app.engine("handlebars", hbs({ defaultDisplay: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

require("./routes/html-routes")(app);
require("./routes/customer-routes")(app);
require("./routes/handyman-routes")(app);

db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function (err) {
    if (err) throw err;
    console.log("Server Listening on http://localhost:" + PORT);
  });
});
