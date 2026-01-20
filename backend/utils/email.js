const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "43d54bf2aaaf75", // replace with your Mailtrap user
      pass: "4a43b089436743", // replace with your Mailtrap password
    },
  });

  // Email options
  const mailOptions = {
    from: `"Asrin Cart" <no-reply@asrin.com>`, // sender
    to: options.email, // receiver
    subject: options.subject,
    text: options.message,
    // html: "<b>Hello World</b>" // optional HTML version
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
