require("dotenv").config();
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morganBody from "morgan-body";
import { counterRouter } from "./counterRouter";
import { usersRouter } from "./usersRouter";

const app = express();
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());
morganBody(app);

// routes
app.use(usersRouter);
app.use(counterRouter);

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("welcome home");
});

// start the Express server
app.listen(process.env.SERVER_PORT, () => {
  console.log("server started at http://localhost:" + process.env.SERVER_PORT);
});
