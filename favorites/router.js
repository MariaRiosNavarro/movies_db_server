import express from "express";
import {
  addOneFavoriteMovieEmbeded,
  getAllFavoritesMovies,
  getOneFavoriteMovie,
  removeOneFavoriteMovie,
  // editOneFavoriteMovie,
} from "./controller.js";
//add multer to parse forms
import multer from "multer";

const upload = multer({ dest: "./uploads" });

export const router = new express.Router();
//add multer for forms, we load only images in the main collection "movies"
router.post("/favorites", upload.none(), addOneFavoriteMovieEmbeded);
//we dont use the edit route in the collection "favorites".
//We update "favorites" in "movie" route editOneMovie.

router.get("/favorites", getAllFavoritesMovies);
router.get("/favorites/:id", getOneFavoriteMovie);
router.delete("/favorites/:id", removeOneFavoriteMovie);
