const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Import routes
const authRoutes = require("./routes/authRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Import Middleware
const { bindUserWithRequest } = require("./middleware/authMiddleware");
const setLocals = require("./middleware/setLocals");

// playground routes
const MONGODB_URI =
  "mongodb+srv://rootAdmin:FxYANcbrVbA7M1lW@cluster0.7clce.mongodb.net/exp-blog?retryWrites=true&w=majority";
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 60 * 60 * 1000 * 2,
});

const app = express();

// setup view enginee
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware array
const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
];

app.use(middleware);

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(
    "mongodb+srv://rootAdmin:FxYANcbrVbA7M1lW@cluster0.7clce.mongodb.net/exp-blog?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("database connected");
      console.log("server is running on port " + PORT);
    });
  })
  .catch((error) => {
    return console.log(error);
  });
