import express from "express";
import {
  addOneFavoriteMovie,
  getAllFavoritesMovies,
  getOneFavoriteMovie,
  deleteOneFavoriteMovie,
  // editOneFavoriteMovie,
} from "./controller.js";
//add multer to parse forms
import multer from "multer";

const upload = multer({ dest: "./uploads" });

export const router = new express.Router();
//add multer for forms &  images, we load only images in the main collection "movies"
router.post("/favorites", upload.none(), addOneFavoriteMovie);
//we dont use the edit route in the collection "favorites", only in main
// router.put("/favorites/:id", upload.single("movieImage"), editOneFavoriteMovie);
//no upload
router.get("/favorites", getAllFavoritesMovies);
router.get("/favorites/:id", getOneFavoriteMovie);
router.delete("/favorites/:id", deleteOneFavoriteMovie);
