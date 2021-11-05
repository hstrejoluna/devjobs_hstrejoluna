const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const vacanciesController = require("../controllers/vacanciesController");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

router.use(express.json());

module.exports = () => {
  router.get("/", homeController.showJobs);

  router.get(
    "/vacancies/new",
    authController.verifyUser,
    vacanciesController.formNewVacancy
  );

  router.post(
    "/vacancies/new",
    authController.verifyUser,
    vacanciesController.addVacancy
  );

  // Show one vacancy
  router.get("/vacancies/:url", vacanciesController.showVacancy);

  // Edit Vacancy
  router.get(
    "/vacancies/edit/:url",
    authController.verifyUser,
    vacanciesController.formEditVacancy
  );
  router.post(
    "/vacancies/edit/:url",
    authController.verifyUser,
    vacanciesController.editVacancy
  );

  router.get("/create-account", usersController.formCreateAccount);
  router.post(
    "/create-account",
    usersController.validateRegister,
    usersController.createUser
  );
  router.get("/login", usersController.formLogin);
  router.post("/login", authController.authUser);

  router.get("/admin", authController.verifyUser, authController.showPanel);

  router.get(
    "/edit-profile",
    authController.verifyUser,
    usersController.formEditProfile
  );

  router.post(
    "/edit-profile",
    authController.verifyUser,
    usersController.editProfile
  );
  return router;
};
