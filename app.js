require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const config = require("config");

// Import routes
const authRoutes = require("./routes/authRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Import Middleware
const { bindUserWithRequest } = require("./middleware/authMiddleware");
const setLocals = require("./middleware/setLocals");

// playground routes
// const validatorRoute = require("./playground/validator");

const MONGODB_URI = `mongodb+srv://${config.get("db-username")}:${config.get(
  "db-password"
)}@cluster0.7clce.mongodb.net/exp-blog?retryWrites=true&w=majority`;
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 60 * 60 * 1000 * 2,
});

const app = express();

console.log(config.get("name"));

if (app.get("env").toLowerCase() === "development") {
  app.use(morgan("dev"));
}

// setup view enginee
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware array
const middleware = [
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: config.get("secret"),
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
  flash(),
];

app.use(middleware);

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
// app.use("/playground", validatorRoute);

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("database connected");
      console.log("server is running on port " + PORT);
    });
  })
  .catch((error) => {
    return console.log(error);
  });
