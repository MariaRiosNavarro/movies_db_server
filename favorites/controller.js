import { dbo } from "../utils/db.js";
import { ObjectId } from "mongodb";
import fs from "fs/promises";

//!Add One Favorite

export const addOneFavoriteMovieEmbeded = async (req, res) => {
  try {
    const favoriteMovie = req.body;

    //No Validation here,
    //Validation was made before in collection movies

    // Save the new movie in db
    const dbResponse = await dbo
      .collection("favorites")
      .insertOne(favoriteMovie);

    //Confirmation back
    if (dbResponse.acknowledged) {
      res.status(201).json({ message: "Favorite successfully added ✅" }).end();
    } else {
      // Handle Error in Database
      res
        .status(500)
        .json({
          error: "Error in database: Insert operation not acknowledged ❌",
        })
        .end();
    }
  } catch (error) {
    // Handle errors
    console.error("Error adding favorite  ❌:", error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Get All Favorite

export const getAllFavoritesMovies = async (req, res) => {
  try {
    //Wait & recibe Data
    const dbResponse = await dbo.collection("favorites").find().toArray();
    res
      .status(200)
      //Confirmation back & data to frontend
      .json({
        message: "Favorites  successfully retrieved ✅",
        data: dbResponse,
      });
  } catch (error) {
    // Handle errors
    console.error("Error reading all favorite  ❌:", error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Get One Favorite

export const getOneFavoriteMovie = async (req, res) => {
  try {
    const id = req.params.id;

    //Wait & recibe Data
    const dbResponse = await dbo
      .collection("favorites")
      .findOne({ _id: new ObjectId(id) });

    //No Response handling
    if (!dbResponse) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    //Confirmation back  & data to frontend
    res.status(200).json({
      message: `Favorite  with id= ${id} sucessfully retrieved ✅`,
      data: dbResponse,
    });
  } catch (error) {
    // Handle errors
    console.error(`Error reading favorite  with id= ${id} ❌:`, error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Delete One Favorite (we dont remove the images here! ->Only in the main "movies" routes we can remove a movie completly

export const removeOneFavoriteMovie = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Favorite  ID is missing" });
    }

    // Find Movie Details
    const dbFindMovie = await dbo.collection("favorites").findOne({ _id: id });

    if (!dbFindMovie) {
      return res.status(404).json({ message: "Favorite  not found" });
    } else {
      // Remove the movie
      const dbResponse = await dbo
        .collection("favorites")
        .deleteOne({ _id: id });

      if (!dbResponse.deletedCount) {
        return res.status(404).json({ message: "Favorite  not found" });
      }

      //Confirmation back
      res.status(200).json({
        message: `Favorite  with id= ${id} successfully deleted ✅`,
      });
    }
  } catch (error) {
    console.error(`Error deleting favorite with id=  ❌:`, error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Edit One Favorite -
// We edit only in the main collection "movies"
