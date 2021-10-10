exports.showJobs = (req, res) => {
  res.render("home", {
    namePage: "devJobs",
    tagLine: "Find and Post Jobs for Web Developers",
    bara: true,
    boton: true,
  });
};
