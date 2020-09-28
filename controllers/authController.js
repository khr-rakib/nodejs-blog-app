const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", { title: "Create A New Account" });
};

exports.signupPostController = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    let hashedPassword = await bcrypt.hash(password, 11);
    let user = new User({
      username,
      email,
      password: hashedPassword,
    });

    let createdUser = await user.save();
    res.render("pages/auth/signup", { title: "Create A New Account" });
    console.log("user created", createdUser);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.loginGetController = (req, res) => {
  res.render("pages/auth/login", { title: "Login Your Account" });
};

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.send("invalid credientials");
    }

    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send("invalid credientials");
    }

    console.log("success login ", user);
    res.render("pages/auth/login", { title: "Login Your Account" });
  } catch (e) {
    console.log(e);
    next();
  }
};

exports.logoutController = (req, res, next) => {};
