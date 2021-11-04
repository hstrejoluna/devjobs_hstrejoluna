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

exports.showVacancy = async (req, res, next) => {
  const vacancy = await Vacancy.findOne({ url: req.params.url });
  console.log("VACANTE ES:" + vacancy);
  // if there's not request
  if (!vacancy) return next();
  res.render("vacancy", {
    vacancy,
    pageName: vacancy.title,
    barra: true,
  });
};

exports.formEditVacancy = async (req, res, next) => {
  const vacancy = await Vacancy.findOne({ url: req.params.url });
  if (!vacancy) return next();
  res.render("edit-vacancy", {
    vacancy,
    pageName: `Edit - ${vacancy.title}`,
  });
};

exports.editVacancy = async (req, res) => {
  const vacancyUpdated = req.body;

  vacancyUpdated.skills = req.body.skills.split(",");

  const vacancy = await Vacancy.findOneAndUpdate(
    { url: req.params.url },
    vacancyUpdated,
    {
      new: true,
      runValidators: true,
    }
  );

  res.redirect(`/vacancies/${vacancy.url}`);
};
