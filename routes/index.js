const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const vacanciesController = require("../controllers/vacanciesController");

module.exports = () => {
  router.get("/", homeController.showJobs);
  router.get("/vacancies/new", vacanciesController.formNewVacancy);
  router.post("/vacancies/new", vacanciesController.addVacancy)
  return router;
};
