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
app.use(express.static(path.join(__dirname, "public")));

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

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use("/", router());

app.listen(process.env.PORT);
