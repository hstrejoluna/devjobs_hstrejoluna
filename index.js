const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("It's Alive!");
});

app.listen(5000);
