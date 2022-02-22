const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
// setup path to public for stylesheet and html
const path = require('path');
// setup handlebars.js
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// The express.static() method is a built in express.js middleware function that 
// can take all of the contents of a folder and serve them as statis assets.
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static(__dirname + '/public'));

// turn on routes
app.use(routes);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});