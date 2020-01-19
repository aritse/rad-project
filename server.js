const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const PORT = process.env.PORT || 3300;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.listen(PORT, function (err) {
    if (err) throw err;
    console.log('Server Listening on http://localhost:' + PORT);
});