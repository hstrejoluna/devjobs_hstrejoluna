import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");

  let alerts = document.querySelector(".alertas");
  if (alerts) {
    cleanAlerts();
  }

  if (skills) {
    skills.addEventListener("click", addSkills);

    skillsSelected();
  }

  const vacanciesList = document.querySelector(".panel-administracion");
  if (vacanciesList) {
    vacanciesList.addEventListener("click", actionsList);
  }
});

const skills = new Set();
const addSkills = (e) => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      skills.delete(e.target.textContent);
      e.target.classList.remove("activo");
    } else {
      skills.add(e.target.textContent);
      e.target.classList.add("activo");
    }
  }
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const skillsSelected = () => {
  const selected = Array.from(
    document.querySelectorAll(".lista-conocimientos .activo")
  );

  selected.forEach((selected) => {
    skills.add(selected.textContent);
  });
  //Inject to hidden
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const cleanAlerts = () => {
  const alerts = document.querySelector(".alertas");
  const interval = setInterval(() => {
    if (alerts.children.length > 0) {
      alerts.removeChild(alerts.children[0]);
    } else if (alerts.children.length === 0) {
      alerts.parentElement.removeChild(alerts);
      clearInterval(interval);
    }
  }, 1500);
};

// delete vacancy
const actionsList = (e) => {
  e.preventDefault();

  if (e.target.dataset.delete) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const url = `${location.origin}/vacancies/delete/${e.target.dataset.delete}`;
        axios
          .delete(url, { params: { url } })
          .then(function (response) {
            if (response.status === 200) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");

              e.target.parentElement.parentElement.parentElement.removeChild(
                e.target.parentElement.parentElement
              );
            }
          })
          .catch(() => {
            Swal.fire({
              type: "error",
              title: "Opps!",
              text: "Can't be deleted",
            });
          });
      }
    });
  } else if (e.target.tagName === "A") {
    window.location.href = e.target.href;
  }
};
