const mongoose = require("mongoose");
const Vacancy = mongoose.model("Vacancy");
const { body, validationResult } = require("express-validator");

exports.formNewVacancy = (req, res) => {
  res.render("new-vacancy", {
    pageName: "New Vacancy",
    tagLine: "Fill the form and publish your vacancy",
  });
};

exports.addVacancy = async (req, res) => {
  const vacancy = new Vacancy(req.body);

  vacancy.author = req.user._id;

  //creates array of skills
  vacancy.skills = req.body.skills.split(",");
  // saves to database
  const newVacancy = await vacancy.save();
  //redirects
  res.redirect(`/vacancies/${newVacancy.url}`);
};

exports.showVacancy = async (req, res, next) => {
  const vacancy = await Vacancy.findOne({ url: req.params.url }).lean();
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
  const vacancy = await Vacancy.findOne({ url: req.params.url }).lean();
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
  ).lean();

  res.redirect(`/vacancies/${vacancy.url}`);
};

exports.validateVacancy = async (req, res, next) => {
  // sanitizar los campos
  req.sanitizeBody("title").escape();
  req.sanitizeBody("company").escape();
  req.sanitizeBody("location").escape();
  req.sanitizeBody("salary").escape();
  req.sanitizeBody("contract").escape();
  req.sanitizeBody("skills").escape();

  // validar
  req.checkBody("title", "Add a Title to the vacancy").notEmpty();
  req.checkBody("company", "Add a Company").notEmpty();
  req.checkBody("location", "Add Location").notEmpty();
  req.checkBody("contract", "Select type of contract").notEmpty();
  req.checkBody("skills", "Skills are required").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    // Recargar la vista con los errores
    req.flash(
      "error",
      errors.map((error) => error.msg)
    );

    res.render("new-vacancy", {
      pageName: "New Vacancy",
      tagLine: "Fill out the form and publish your vacancy",
      logout: true,
      name: req.user.name,
      messages: req.flash(),
    });
    return;
  }

  next(); // siguiente middleware
};

exports.deleteVacancy = async (req, res) => {
  const { id } = req.params;

  const vacancy = await Vacancy.findById(id);

  if (verifyAuthor(vacancy, req.user)) {
    vacancy.remove();
    res.status(200).send("Vacancy deleted");
  } else {
    res.status(403).send("Error");
  }


};

const verifyAuthor = (vacancy = {}, user = {}) => {
  if (!vacancy.author.equals(user._id)) {
    return false;
  }
  return true;
};
