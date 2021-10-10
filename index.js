const express = require("express");
const exphbs = require("express-handlebars");
const router = require("./routes");

const app = express();

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "layout",
  })
);
app.set("view engine", "handlebars");

app.use("/", router());

app.listen(5000);
