const router = require("express").Router();
const Users = require("../modals/user");
const authenticateToken = require("../middlewares/authenticateToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

router.route("/").get(authenticateToken, (req, res) => {
  Users.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/send_email").post(authenticateToken, async (req, res) => {
  const { subject, content, recipientEmail } = req.body;

  let mailOptions = {
    from: "deepaguvi@gmail.com",
    subject: subject,
    html: `${content}<br/> <p>Best Regards, <br/>${req.body.name}</p>`
  };

  if (Array.isArray(recipientEmail)) {
    // Multiple recipients
    mailOptions.to = recipientEmail.join(", ");
  } else {
    // Single recipient
    mailOptions.to = recipientEmail;
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "deepaguvi@gmail.com",
      pass: "jmzg pfgh ntyl qest",
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({message:"Error sending email"});
    } else {
      res.status(200).json({message:"Email sent successfully"});
    }
  });
});

router.route("/login").post(async (req, res) => {
  // Authenticate

  try {
    var user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "User not found Please register" });
    }
    var validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.json({ error: "Your password is incorrect" });
    }

    const username = req.body.email;
    const role = "3D Lead";
    const team = "Team FOX";
    const userData = { name: username, role: role, team: team };
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN);

    res.json({ accessToken: accessToken });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.route("/register").post((req, res) => {
  const { username, email, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
      const password = hashedPassword;
      const newUser = new Users({ username, password, email });
      newUser
        .save()
        .then(() =>
          res.json({
            message: "New Account Created Successfully.Login with credetinals",
          })
        )
        .catch((err) => res.status(400).json({ error: err.message }));
    });
  });
});

module.exports = router;
