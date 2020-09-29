const router = require("express").Router();

const {
  dashboardGetController,
} = require("../controllers/dashboardController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, dashboardGetController);

module.exports = router;
