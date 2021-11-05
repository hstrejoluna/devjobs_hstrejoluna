const passport = require("passport");

exports.authUser = passport.authenticate("local", {
  successRedirect: "/ok",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.verifyUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("User is authenticated")
    return next();
  }
  console.log("User is not authenticated")
  res.redirect("/login");
};


exports.showPanel = (req, res) => {
  res.render("admin", {
    pageName: "Admin Dashboard",
    tagLine: "Create and Manage your vacancies here",
  });
};
