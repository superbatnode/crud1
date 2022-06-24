const express = require("express");
const api_route = require("./routes");
const app = express();
const cors = require("cors");
const dbcon = require("./database/connection");
const errorHandler = require("./error/errorHandler");
const { PORT } = require("./config");
const bodyParser = require("body-parser");
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
app.use(cors());
app.use(express.json());
dbcon()
    .then(() => console.log("db connected"))
    .catch(e => console.log("unable to connect db:  " + e));
app.get("/", (req, res) => res.json({ connection: "done" }));
app.use("/user", api_route);
app.use("*", (req, res, next) => next("page not found"));
app.use(errorHandler);
app.listen(PORT, () => console.log("server's up"));
