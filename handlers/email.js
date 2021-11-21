const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const util = require("util");

const hostmail = process.env.HOSTMAIL;
const portmail = process.env.PORTMAIL;
const authmail = {
  usermail: process.env.USERMAIL,
  passmail: process.env.PASSMAIL,
};

let transport = nodemailer.createTransport({
  host: hostmail,
  port: portmail,
  auth: {
    user: authmail.usermail,
    pass: authmail.passmail,
  },
});

transport.use(
  "compile",
  hbs({
    viewEngine: {
      extName: "handlebars",
      partialsDir: __dirname + "/../views/emails",
      layoutsDir: __dirname + "/../views/emails",
      defaultLayout: "reset.handlebars",
    },
    viewPath: __dirname + "/../views/emails",
    extName: ".handlebars",
  })
);

exports.send = async (options) => {
  const optionsEmail = {
    from: "DevJobs <noreply@devjobs.com",
    to: options.user.email,
    subject: options.subject,
    template: options.fileName,
    context: {
      resetUrl: options.resetUrl,
    },
  };

  const sendMail = util.promisify(transport.sendMail, transport);
  return sendMail.call(transport, optionsEmail);
};
