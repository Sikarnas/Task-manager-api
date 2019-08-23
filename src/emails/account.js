const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (email, name, type) => {
  if (type === "welcome") {
    subject = `Welcome to Task app`;
    text = `Hello, ${name}, Welcome to the Task manager app, enjoy it`;
  } else if (type === "cancelation") {
    subject = `You successfully deleted your account :(`;
    text = `Hello, ${name}, sorry that you have to leave us, what we could have done better ?`;
  }

  sgMail.send({
    to: email,
    from: "auritoz95@gmail.com",
    subject,
    text
  });
};

module.exports = {
  sendEmail
};
