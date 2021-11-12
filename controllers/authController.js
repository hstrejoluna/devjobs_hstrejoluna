const passport = require("passport");
const mongoose = require("mongoose");
const Vacancy = mongoose.model("Vacancy");
const Users = mongoose.model("Users");
const crypto = require("crypto");
const sendEmail = require("../handlers/email");

exports.authUser = passport.authenticate("local", {
  successRedirect: "/admin",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.verifyUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
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

exports.sendToken = async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });

  if (!user) {
    req.flash("error", "Account not exists");
    return res.redirect("/login");
  }

  user.token = crypto.randomBytes(20).toString("hex");
  user.expiry = Date.now() + 3600000;

  await user.save();
  const resetUrl = `http://${req.headers.host}/recover-password/${user.token}`;

  await sendEmail.send({
    user,
    subject: "Password Reset one",
    resetUrl,
    fileName: "reset",
  });

  req.flash("correcto", "We sent you an email with instructions");
  res.redirect("/login");
};

exports.recoverPassword = async (req, res) => {
  const user = await Users.findOne({
    token: req.params.token,
    expiry: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "The form is not valid, please submit again");
    return res.redirect("/recover-password");
  }

  res.render("new-password", {
    pageName: "New Password",
  })
};
