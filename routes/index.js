const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const vacanciesController = require("../controllers/vacanciesController");

module.exports = () => {
  router.get("/", homeController.showJobs);
  router.get("/vacancies", vacanciesController.formNewVacancy);
  return router;
};
