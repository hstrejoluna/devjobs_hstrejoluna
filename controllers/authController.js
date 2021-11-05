const passport = require("passport");

exports.authUser = passport.authenticate("local", {
  successRedirect: "/ok",
  failureRedirect: "/fail",
});
