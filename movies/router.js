import express from "express";
import {
  addOneMovie,
  getAllMovies,
  getOneMovie,
  deleteOneMovie,
  editOneMovieInAllCollections,
  updateFavoriteMovie,
} from "./controller.js";
//add multer to parse forms
import multer from "multer";

const upload = multer({ dest: "./uploads" });

export const router = new express.Router();
//add multer for forms &  images
router.post("/movies", upload.single("movieImage"), addOneMovie);
router.put(
  "/movies/:id",
  upload.single("movieImage"),
  editOneMovieInAllCollections
);
//no upload
router.get("/movies", getAllMovies);
router.get("/movies/:id", getOneMovie);
router.delete("/movies/:id", deleteOneMovie);

//--------------------------------------------------------------------------------------PATCH VERSION (no extra "collection" need it)

router.patch("/movies/:id/favorite", updateFavoriteMovie);
