const mongoose = require("mongoose");
const Users = mongoose.model("Users");

exports.formCreateAccount = (req, res) => {
  res.render("create-account", {
    pageName: "Signup on DevJobs",
    tagLine: "Publish your vacancies free, just create an account",
  });
};

exports.createUser = async (req, res, next) => {
  const user = new Users(req.body);
  const newUser = await user.save();
  if(!newUser){
    return next()
  }
  res.redirect("/login")
};
