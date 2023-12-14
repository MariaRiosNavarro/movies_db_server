import { dbo } from "../utils/db.js";
import { ObjectId } from "mongodb";

//!Add One Movie

export const addOneMovie = async (req, res) => {
  try {
    const movie = {
      movieTitle: req.body.movieTitle,
      movieReleaseYear: Number(req.body.movieReleaseYear),
      movieRuntime: Number(req.body.movieRuntime),
      movieDescription: req.body.movieDescription,
      movieRating: Number(req.body.movieRating),
      movieVoteCount: Number(req.body.movieVoteCount),
      //Genres is an Array of genres
      movieGenres: req.body.movieGenres,
      movieLanguage: req.body.movieLanguage,
    };

    // Check if at least the movie.movieTitle is present
    if (!movie.movieTitle) {
      return res.status(400).json({ error: "Title is necessary." });
    }

    // Save the new movie in db
    const dbResponse = await dbo.collection("movies").insertOne(movie);

    //Confirmation back
    if (dbResponse.acknowledged) {
      res.status(201).json({ message: "Movie successfully added ✅" }).end();
    } else {
      // Handle Error in Database
      res
        .status(500)
        .json({
          error: "Error in Database: Insert operation not acknowledged ❌",
        })
        .end();
    }
  } catch (error) {
    // Handle errors
    console.error("Error adding movie ❌:", error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Get All Movie

export const getAllMovies = async (req, res) => {
  try {
    //Wait & recibe Data
    const dbResponse = await dbo.collection("movies").find().toArray();
    res
      .status(200)
      //Confirmation back & data to frontend
      .json({ message: "Quotes successfully retrieved ✅", data: dbResponse });
  } catch (error) {
    // Handle errors
    console.error("Error Reading all quotes ❌:", error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Get One Movie

export const getOneMovie = async (req, res) => {
  try {
    const id = req.params.id;

    //No id handling
    if (!id) {
      return res.status(400).json({ error: "Movie ID is missing" });
    }
    //Wait & recibe Data
    const dbResponse = await dbo
      .collection("movies")
      .findOne({ _id: new ObjectId(id) });

    //No Response handling
    if (!dbResponse) {
      return res.status(404).json({ message: "Movie not found" });
    }

    //Confirmation back  & data to frontend
    res.status(200).json({
      message: `Movie with id= ${id} sucessfully retrieved ✅`,
      data: dbResponse,
    });
  } catch (error) {
    // Handle errors
    console.error(`Error Reading Movie with id= ${id} ❌:`, error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Delete One Movie

export const deleteOneMovie = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Movie ID is missing" });
    }
    //Wait & remove one movie
    const dbResponse = await dbo
      .collection("movies")
      .deleteOne({ _id: new ObjectId(id) });
    //Confirmation back
    res
      .status(200)
      .json({ message: `Movie with id= ${id} sucessfully deleted ✅` });
  } catch (error) {
    // Handle errors
    console.error(`Error deleting Movie with id= ${id} ❌:`, error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Edit One Movie

export const editOneMovie = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Movie ID is missing" });
    }
    const newData = req.body;
    //Wait & update one movie
    const dbResponse = await dbo
      .collection("movies")
      .updateOne({ _id: new ObjectId(id) }, { $set: newData });
    //Confirmation back
    res.status(201).json({
      message: `Movie with id= ${id} sucessfully updated ✅`,
      data: newData,
    });
  } catch (error) {
    // Handle errors
    console.error("Error editing Movie ❌:", error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};
