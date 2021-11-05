const passport = require("passport");

exports.authUser = passport.authenticate("local", {
  successRedirect: "/ok",
  failureRedirect: "/login",
  failureFlash: true,
});
