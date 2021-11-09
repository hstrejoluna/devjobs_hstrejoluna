const passport = require("passport");
const mongoose = require("mongoose");
const Vacancy = mongoose.model("Vacancy");

exports.authUser = passport.authenticate("local", {
  successRedirect: "/admin",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.verifyUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("User is not authenticated");
  res.redirect("/login");
};

exports.showPanel = async (req, res) => {
  const vacancies = await Vacancy.find({ author: req.user._id });

  res.render("admin", {
    pageName: "Admin Dashboard",
    tagLine: "Create and Manage your vacancies here",
    logout: true,
    name: req.user.name,
    image: req.user.image,
    vacancies,
  });
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("correcto", "You have been logged out, see you later");
  res.redirect("/login");
};

exports.formRecoverPassword = (req, res) => {
  res.render("recover-password", {
    pageName: "Recover Password",
    tagLine: "Enter your email for send recover link",
  });
};
