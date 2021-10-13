document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");
  if (skills) {
    skills.addEventListener("click", addSkills);
  }
});

const skills = new Set();
const addSkills = (e) => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      skills.delete(e.target.textContent);
      e.target.classList.remove("active");
    } else {
      skills.add(e.target.textContent);
      e.target.classList.add("activo");
    }
  }
};
