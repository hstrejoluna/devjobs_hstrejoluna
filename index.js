const mongoose = require("mongoose");
require("./config/db");

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const createError = require("http-errors");
const passport = require("./config/passport");

const handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

require("dotenv").config({ path: "variables.env" });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Validate forms
app.use(expressValidator());

// Enable handlebars as a view
app.engine(
  "handlebars",
  exphbs({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: "layout",
    helpers: require("./helpers/handlebars"),
  })
);
app.set("view engine", "handlebars");

// static files
app.use(express.static('public'));



app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use("/", router());

app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

//Error handler
app.use((error, req, res, next) => {
  res.locals.message = error.message;
  const status = error.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render("error");
});

// Heroku port
const host = "0.0.0.0";
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
  console.log(`Server started at http://${host}:${port}`);
});
