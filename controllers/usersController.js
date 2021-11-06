const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const multer = require("multer");

exports.uploadImage = (req, res, next) => {
  upload(req, res, function (error) {
    if (error instanceof multer.multerError) {
      return next();
    }
  });
  next();
};

exports.formCreateAccount = (req, res) => {
  res.render("create-account", {
    pageName: "Signup on DevJobs",
    tagLine: "Publish your vacancies free, just create an account",
  });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody("name").escape();
  req.sanitizeBody("email").escape();
  req.sanitizeBody("password").escape();
  req.sanitizeBody("confirm").escape();

  req.checkBody("name", "Your name is required").notEmpty();
  req.checkBody("email", "Your email is not valid").isEmail();
  req.checkBody("password", "Your password can't be empty").notEmpty();
  req
    .checkBody("confirm", "Your confirmation password can't be empty")
    .notEmpty();
  req
    .checkBody("confirm", "The password is not the same")
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash(
      "error",
      errors.map((error) => error.msg)
    );

    res.render("create-account", {
      pageName: "Signup on DevJobs",
      tagLine: "Publish your vacancies free, just create an account",
      messages: req.flash(),
    });
    return;
  }
  next();
};

exports.createUser = async (req, res, next) => {
  const user = new Users(req.body);
  try {
    await user.save();
    res.redirect("/login");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/create-account");
  }
};

exports.formLogin = (req, res) => {
  res.render("login", {
    pageName: "Login devJobs",
  });
};

exports.formEditProfile = (req, res) => {
  res.render("edit-profile", {
    pageName: "Edit Profile",
    user: req.user,
    logout: true,
    name: req.user.name,
  });
};

exports.editProfile = async (req, res) => {
  const user = await Users.findById(req.user._id);
  user.name = req.body.name;
  user.email = req.body.email;
  if (req.body.password) {
    user.password = req.body.password;
  }
  await user.save();

  req.flash("correcto", "Your profile has been updated");

  res.redirect("/admin");
};

exports.validateEditProfile = (req, res, next) => {
  req.sanitizeBody("name").escape();
  req.sanitizeBody("email").escape();
  req.sanitizeBody("password").escape();

  req.checkBody("name", "Your name is required").notEmpty();
  req.checkBody("email", "Your email is not valid").isEmail();
  req.checkBody("password", "Your password can't be empty").notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash(
      "error",
      errors.map((error) => error.msg)
    );

    res.render("edit-profile", {
      pageName: "Edit Profile",
      user: req.user,
      logout: true,
      name: req.user.name,
    });
    return;
  }
  next();
};
