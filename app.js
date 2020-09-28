const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/authRoute");

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
];

app.use(middleware);

app.use("/auth", authRoutes);

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
