import express from "express";
import {
  addOneMovie,
  getAllMovies,
  getOneMovie,
  deleteOneMovie,
  editOneMovie,
} from "./controller.js";
//add multer to parse forms
import multer from "multer";

const upload = multer({ dest: "./uploads" });

export const router = new express.Router();
//add multer for forms & maybe images in the future, not now  -- upload.single("moviesImage")
router.post("/movies", upload.single("movieImage"), addOneMovie);
router.put("/movies/:id", upload.single("movieImage"), editOneMovie);
//no upload
router.get("/movies", getAllMovies);
router.get("/movies/:id", getOneMovie);
router.delete("/movies/:id", deleteOneMovie);
