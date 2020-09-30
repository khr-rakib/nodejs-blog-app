const authRoutes = require("./authRoute");
const dashboardRoutes = require("./dashboardRoutes");
const playgroundRoute = require("../playground/play");

const routes = [
  {
    path: "/auth",
    handler: authRoutes,
  },
  {
    path: "/dashboard",
    handler: dashboardRoutes,
  },
  {
    path: "/playground",
    handler: playgroundRoute,
  },
  {
    path: "/",
    handler: (req, res) => {
      res.json({
        message: "Hello world !",
      });
    },
  },
];

module.exports = (app) => {
  routes.forEach((r) => {
    if (r.path === "/") {
      app.get(r.path, r.handler);
    } else {
      app.use(r.path, r.handler);
    }
  });
};
