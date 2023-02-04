require("dotenv").config();
const express = require("express");
const database = require("./database");
const appEx = require("./database");
const logger = require("./utils/logger");
const { response } = require("./utils/response");
const app = express();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const openApiDocumentation = YAML.load("./api-docs/apiDocumentation.yml");

//* open api documentation middleware
app.use(
  "/api/v1/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocumentation)
);

//* db connection
database();

//* test route
app.get("/api/v1/testroute", (req, res) => {
  res.status(200).json(response(true, 200, "Server is responding"));
});

//* listening to server
app.listen(process.env.PORT, () => {
  console.log(`SERVER STARTED ON PORT:${process.env.PORT}`);
});
