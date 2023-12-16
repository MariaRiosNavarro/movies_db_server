import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as moviesRouter } from "./movies/router.js";
import { router as favoritesRouter } from "./favorites/router.js";
const app = express();

app.use(cors());
app.use(express.json()); //body parser -> header 'Content-Type': 'application/json'

app.use("/uploads", express.static("./uploads"));
app.use("/api", moviesRouter);
app.use("/api", favoritesRouter);

app.listen(process.env.PORT, () =>
  console.log(console.log("Port is:http://localhost:" + process.env.PORT))
);
