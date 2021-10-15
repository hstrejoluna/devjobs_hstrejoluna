const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const vacanciesController = require("../controllers/vacanciesController");

module.exports = () => {
  router.get("/", homeController.showJobs);
  router.get("/vacancies/new", vacanciesController.formNewVacancy);
  router.post("/vacancies/new", vacanciesController.addVacancy);

  // Show one vacancy
  router.get("/vacancies/:url", vacanciesController.showVacancy);

  // Edit Vacancy
  router.get("/vacancies/edit/:url", vacanciesController.formEditVacancy);
  router.post('/vacancies/edit/:url', vacanciesController.editVacancy);
  return router;
};
