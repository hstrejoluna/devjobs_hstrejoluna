exports.formNewVacancy = (req, res) => {
  res.render("new-vacancy", {
    pageName: "New Vacancy",
    tagline: "Fill the form and publish your vacancy",
  });
};
