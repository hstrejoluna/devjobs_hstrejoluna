const mongoose = require("mongoose");
const Vacancy = mongoose.model("Vacancy");

const multer = require("multer");
const shortid = require("shortid");

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
  const vacancy = await Vacancy.findOne({ url: req.params.url })
    .populate("author")
    .lean();
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
    logout: true,
    name: req.user.name,
    image: req.user.image,
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
      image: req.user.image,
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

exports.uploadCV = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "The file is too big: 500kb Max");
        } else {
          req.flash("error", error.message);
        }
      } else {
        req.flash("error", error.message);
      }
      res.redirect("/back");
      return;
    } else {
      return next();
    }
  });
};

const settingsMulter = {
  limits: { fileSize: 500000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "../../public/uploads/cv");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Format not valid"), false);
    }
  },
};

const upload = multer(settingsMulter).single("cv");

exports.contact = async (req, res, next) => {
  const vacancy = await Vacancy.findOne({ url: req.params.url });

  if (!vacancy) return next();

  const newCandidate = {
    name: req.body.name,
    email: req.body.email,
    cv: req.file.filename,
  };

  vacancy.candidates.push(newCandidate);
  await vacancy.save();

  req.flash("correcto", "Your application has delivered successfully");
  res.redirect("/");
};
