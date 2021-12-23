const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const sendinBlue = require("nodemailer-sendinblue-transport");

// const transporter = nodemailer.createTransport(
//   smtpTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//       user: "oktiodev@gmail.com", //config.email
//       pass: "welcome@123", //config.pass //password
//     },
//   })
// );
const transporter = nodemailer.createTransport({
  service: "SendinBlue",
  auth: {
    user: "contact@oktio.io", //config.email
    pass: "HACBQpXJOfs12nkh", //config.pass //password
  },
});

exports.transporter = transporter;
