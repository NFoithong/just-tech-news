const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
// setup path to public for stylesheet and html
// setup handlebars.js
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
// express-session and connect-session-squelize
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super scret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// The express.static() method is a built in express.js middleware function that 
// can take all of the contents of a folder and serve them as statis assets.
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public'));
// app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public/style.css'));

app.use(session(sess));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});