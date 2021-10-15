const mongoose = require("mongoose");
const Vacancy = mongoose.model("Vacancy");

exports.formNewVacancy = (req, res) => {
  res.render("new-vacancy", {
    pageName: "New Vacancy",
    tagLine: "Fill the form and publish your vacancy",
  });
};

exports.addVacancy = async (req, res) => {
  const vacancy = new Vacancy(req.body);

  //creates array of skills
  vacancy.Skills = req.body.Skills.split(",");

  // saves to database
  const newVacancy = await vacancy.save();

  //redirects
  res.redirect(`/vacancies/${newVacancy.url}`);
};
