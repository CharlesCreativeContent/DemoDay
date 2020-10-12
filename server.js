// server.js

//====================== set up =====================//
//================all the tools we need==============//
const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const multer = require('multer');
const ObjectId = require('mongodb').ObjectID

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

const configDB = require('./config/database.js');

//======================configuration =======================//
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
// connect to our database
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  connect(database)
});

//================set up our express application============//
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
require('./config/passport')(passport); // pass passport for configuration
app.use(session({
    secret: 'rcbootcamp2019c', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
const connect = (db) => require('./app/routes.js')(app, passport, db, multer, ObjectId); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
