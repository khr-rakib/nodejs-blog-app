const router = require("express").Router();
const { check, validationResult } = require("express-validator");

router.get("/validator", (req, res, next) => {
  res.render("playground/signup", { title: "validator playground" });
});

router.post(
  "/validator",
  [
    check("username")
      .notEmpty()
      .withMessage("username can not be empty")
      .isLength({ max: 15 })
      .withMessage("Username can't be greather then 15 character")
      .trim(),

    check("email")
      .isEmail()
      .withMessage("please provide a valid email")
      .normalizeEmail(),
    check("password").custom((value) => {
      if (value.length < 5) {
        throw new Error("password must be greather than 5 characters");
      }
      return true;
    }),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password does not match");
      }
      return true;
    }),
  ],
  (req, res, next) => {
    let errors = validationResult(req);

    const formatter = (error) => error.msg;

    console.log(errors.array());
    console.log(errors.formatWith(formatter).mapped());
    res.render("playground/signup", { title: "validator playground" });
  }
);

module.exports = router;
