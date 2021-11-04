module.exports = {
  selectSkills: (selected = [], options) => {
    const skills = [
      "HTML5",
      "CSS3",
      "CSSGrid",
      "Flexbox",
      "JavaScript",
      "jQuery",
      "Node",
      "Angular",
      "VueJS",
      "ReactJS",
      "React Hooks",
      "Redux",
      "Apollo",
      "GraphQL",
      "TypeScript",
      "PHP",
      "Laravel",
      "Symfony",
      "Python",
      "Django",
      "ORM",
      "Sequelize",
      "Mongoose",
      "SQL",
      "MVC",
      "SASS",
      "WordPress",
    ];
    let html = "";
    skills.forEach((skill) => {
      html += `
            <li ${
              selected.includes(skill) ? ' class="activo"' : ""
            }>${skill}</li>    
    `;
    });
    return (options.fn().html = html);
  },
  contractType: (selected, options) => {
    return options
      .fn(this)
      .replace(new RegExp(`value="${selected}"`), '$& selected="selected"');
  },

  showAlerts: (errors = {}, alerts) => {
    const category = Object.keys(errors);

    let html = "";
    if (category.length) {
      errors[category].forEach((error) => {
        html += `<div class="${category} alerta"> ${error} </div>`;
      });
    }
    return (alerts.fn().html = html);
  },
};
