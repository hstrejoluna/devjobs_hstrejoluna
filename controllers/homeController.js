const mongoose = require("mongoose");
const Vacancy = mongoose.model("Vacancy");

exports.showJobs = async (req, res, next) => {
  const vacancies = await Vacancy.find({});

  if (!vacancies) return next();

  res.render("home", {
    pageName: "devJobs",
    tagLine: "Find and Post Jobs for Web Developers",
    barra: true,
    boton: true,
    vacancies,
  });
};
