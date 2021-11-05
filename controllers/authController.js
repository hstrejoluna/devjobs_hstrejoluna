const passport = require("passport");

exports.authUser = passport.authenticate("local", {
  successRedirect: "/ok",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.showPanel = (req, res) => {
  res.render("admin", {
    pageName: "Admin Dashboard",
    tagLine: "Create and Manage your vacancies here",
  });
};
