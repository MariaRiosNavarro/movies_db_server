import { dbo } from "../utils/db.js";
import { ObjectId } from "mongodb";
import fs from "fs/promises";

//!Add One Movie

export const addOneMovie = async (req, res) => {
  try {
    const movie = req.body;
    //Handle Image
    movie.movieImage = req.file.path;
    //Save Number Values
    movie.movieReleaseYear = Number(movie.movieReleaseYear);
    movie.movieRuntime = Number(movie.movieRuntime);
    movie.movieRating = Number(movie.movieRating);
    movie.movieVoteCounmovieVoteCount = Number(movie.movieVoteCount);
    //Genres is an Array of genres
    movie.movieGenres = Array(movie.movieGenres);

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
      .json({ message: "Movies successfully retrieved ✅", data: dbResponse });
  } catch (error) {
    // Handle errors
    console.error("Error Reading all movies ❌:", error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Get One Movie

export const getOneMovie = async (req, res) => {
  try {
    const id = req.params.id;

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

//!Delete One Movie & the file (img) if it is here in uploads

export const deleteOneMovie = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Movie ID is missing" });
    }

    // Find Movie Details
    const dbFindMovie = await dbo
      .collection("movies")
      .findOne({ _id: new ObjectId(id) });

    if (!dbFindMovie) {
      return res.status(404).json({ message: "Movie not found" });
    } else {
      // Save the image path before deleting the movie
      let serverImage = dbFindMovie.movieImage;
      // Remove the movie
      const dbResponse = await dbo
        .collection("movies")
        .deleteOne({ _id: new ObjectId(id) });

      if (!dbResponse.deletedCount) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Delete the image if it's on the server
      if (serverImage.includes("upload")) {
        await fs.unlink(serverImage);
      } else {
        console.log(
          "Image is an external link, we dont need to remove it from server:",
          serverImage
        );
      }
      //Confirmation back
      res
        .status(200)
        .json({ message: `Movie with id= ${id} successfully deleted ✅` });
    }
  } catch (error) {
    console.error(`Error deleting Movie with id=  ❌:`, error);
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

    // Save new Data
    const newData = req.body;

    //Check if we have new file/Image in the new data->add the path to the newData
    let newImageFile = req.file;

    if (newImageFile) {
      newData.movieImage = newImageFile.path;
    }

    // Find Old Movie Details
    const dbFindOldMovie = await dbo
      .collection("movies")
      .findOne({ _id: new ObjectId(id) });

    //If we dont find the Movie id, save the movie as new Movie and close (return) the function
    if (!dbFindOldMovie) {
      await addOneMovie(req, res);
      return;
    } else {
      // Save the image path before the possibility to deleting the old image in our server
      let oldImage = dbFindOldMovie.movieImage;

      //Wait & update the movie with the new data
      const dbResponse = await dbo
        .collection("movies")
        .updateOne({ _id: new ObjectId(id) }, { $set: newData });

      //No Response handling
      if (!dbResponse) {
        return res.status(404).json({ message: "Movie to update dont found" });
      }

      // Verify that newData.movieImage exists before attempting
      // to delete the old image. Check to make sure that there
      // really is a new image before trying to delete the old one.

      if (
        newData.movieImage &&
        newData.movieImage.includes("upload") &&
        oldImage.includes("upload")
      ) {
        await fs.unlink(oldImage);
      } else {
        console.log("We don't need to remove the old image", oldImage);
      }

      //Confirmation back
      res.status(201).json({
        message: `Movie with id= ${id} sucessfully updated ✅`,
        data: newData,
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error editing Movie ❌:", error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//--------------------------------------------------------------------------------------PATCH VERSION (no extra "collection" need it)

// Update Favorite Status
export const updateFavoriteMovie = async (req, res) => {
  try {
    const id = req.params.id;
    const { favorite } = req.body;

    if (favorite === undefined) {
      return res.status(400).json({ error: "Favorite status is missing" });
    }

    // Update the favourite characteristic in the database
    const dbResponse = await dbo
      .collection("movies")
      .updateOne({ _id: new ObjectId(id) }, { $set: { favorite } });

    // Response handling
    if (!dbResponse) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Confirmation
    res.status(200).json({
      message: `Favorite status of movie with id= ${id} successfully updated ✅`,
      data: { favorite },
    });
  } catch (error) {
    // Error Handling
    console.error(
      `Error updating favorite status of movie with id= ${id} ❌:`,
      error
    );
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};
