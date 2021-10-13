exports.showJobs = (req, res) => {
  res.render("home", {
    pageName: "devJodbs",
    tagLine: "Find and Post Jobs for Web Developers",
    barra: true,
    boton: true,
  });
};
