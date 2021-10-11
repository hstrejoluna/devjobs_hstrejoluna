exports.showJobs = (req, res) => {
  res.render("home", {
    namePage: "devJobs",
    tagLine: "Find and Post Jobs for Web Developers",
    barra: true,
    boton: true,
  });
};
