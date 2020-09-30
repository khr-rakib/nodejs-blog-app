require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const setMiddleware = require("./middleware/middlewares");
const setRoutes = require("./routes/routes");

const MONGODB_URI = `mongodb+srv://${config.get("db-username")}:${config.get(
  "db-password"
)}@cluster0.7clce.mongodb.net/exp-blog?retryWrites=true&w=majority`;

const app = express();

// setup view enginee
app.set("view engine", "ejs");
app.set("views", "views");

// Using middleware from middleware directory
setMiddleware(app);

// Using routes from routes directory
setRoutes(app);

app.use((req, res, next) => {
  let error = new Error("404 Page Not Found !");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (error.status === 404) {
    return res.render("pages/error/404", { flashMessage: {} });
  }
  return res.render("pages/error/500", { flashMessage: {} });
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
