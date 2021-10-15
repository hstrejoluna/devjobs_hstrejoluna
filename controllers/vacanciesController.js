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

exports.showVacancy = async (req, res, next) =>{
  const vacancy = await Vacancy.findOne({ url: req.params.url }).lean();

  // if there's not request
  if(!vacancy) return next();

  res.render('vacancy', {
    vacancy,
    pageName : vacancy.Title,
    barra: true
  })
}
