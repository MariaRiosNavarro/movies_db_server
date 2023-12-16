import { dbo } from "../utils/db.js";
import { ObjectId } from "mongodb";
import fs from "fs/promises";

//!Add One Favorite

export const addOneFavoriteMovie = async (req, res) => {
  try {
    const favoriteMovie = req.body;

    //No Validation here, Validation was made before in collection movies, before to come here

    //Handle Image
    // movie.movieImage = req.file.path;
    // //Save Number Values
    // movie.movieReleaseYear = Number(movie.movieReleaseYear);
    // movie.movieRuntime = Number(movie.movieRuntime);
    // movie.movieRating = Number(movie.movieRating);
    // movie.movieVoteCounmovieVoteCount = Number(movie.movieVoteCount);
    // //Genres is an Array of genres
    // movie.movieGenres = Array(movie.movieGenres);

    // // Check if at least the movie.movieTitle is present
    // if (!movie.movieTitle) {
    //   return res.status(400).json({ error: "Title is necessary." });
    // }

    // Save the new movie in db
    const dbResponse = await dbo
      .collection("favorites")
      .insertOne(favoriteMovie);

    //Confirmation back
    if (dbResponse.acknowledged) {
      res
        .status(201)
        .json({ message: "Favorite movie successfully added ✅" })
        .end();
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
    console.error("Error adding favorite movie ❌:", error);
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
        message: "Favorites movies successfully retrieved ✅",
        data: dbResponse,
      });
  } catch (error) {
    // Handle errors
    console.error("Error reading all favorite  movies ❌:", error);
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
      return res.status(404).json({ message: "Favorite movie not found" });
    }

    //Confirmation back  & data to frontend
    res.status(200).json({
      message: `Favorite movie with id= ${id} sucessfully retrieved ✅`,
      data: dbResponse,
    });
  } catch (error) {
    // Handle errors
    console.error(`Error reading favorite movie with id= ${id} ❌:`, error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Delete One Favorite (we dont remove the images here! ->Only in the main "movies" routes we can remove a movie completly

export const deleteOneFavoriteMovie = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "Favorite movie ID is missing" });
    }

    // Find Movie Details
    const dbFindMovie = await dbo
      .collection("favorites")
      .findOne({ _id: new ObjectId(id) });

    if (!dbFindMovie) {
      return res.status(404).json({ message: "Favorite movie not found" });
    } else {
      // // Save the image path before deleting the movie
      // let serverImage = dbFindMovie.movieImage;
      // Remove the movie
      const dbResponse = await dbo
        .collection("favorites")
        .deleteOne({ _id: new ObjectId(id) });

      if (!dbResponse.deletedCount) {
        return res.status(404).json({ message: "Favorite movie not found" });
      }

      // Delete the image if it's on the server
      // if (serverImage.includes("upload")) {
      //   await fs.unlink(serverImage);
      // } else {
      //   console.log(
      //     "Image is an external link, we dont need to remove it from server",
      //     serverImage
      //   );
      // }

      //Confirmation back
      res.status(200).json({
        message: `Favorite movie with id= ${id} successfully deleted ✅`,
      });
    }
  } catch (error) {
    console.error(`Error deleting Movie with id=  ❌:`, error);
    res.status(500).json({ error: "Internal Server Error ❌" });
  }
};

//!Edit One Favorite - We edit only in the main collection "movies" in Frontend-

// export const editOneFavoriteMovie = async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!id) {
//       return res.status(400).json({ error: "Favorite movie ID is missing" });
//     }

//     // Save new Data
//     const newData = req.body;

//     //Check if we have new file/Image in the new data->add the path to the newData
//     let newImageFile = req.file;

//     if (newImageFile) {
//       newData.movieImage = newImageFile.path;
//     }

//     // Find Old Movie Details
//     const dbFindOldMovie = await dbo
//       .collection("favorites")
//       .findOne({ _id: new ObjectId(id) });

//     //If we dont find the Movie id, save the movie as new Movie and close (return) the function
//     if (!dbFindOldMovie) {
//       await addOneMovie(req, res);
//       return;
//     } else {
//       // Save the image path before the possibility to deleting the old image in our server
//       let oldImage = dbFindOldMovie.movieImage;

//       //Wait & update the movie with the new data
//       const dbResponse = await dbo
//         .collection("favorites")
//         .updateOne({ _id: new ObjectId(id) }, { $set: newData });

//       //No Response handling
//       if (!dbResponse) {
//         return res
//           .status(404)
//           .json({ message: "Favorite movie to update dont found" });
//       }

//       // Verify that newData.movieImage exists before attempting
//       // to delete the old image. Check to make sure that there
//       // really is a new image before trying to delete the old one.

//       if (
//         newData.movieImage &&
//         newData.movieImage.includes("upload") &&
//         oldImage.includes("upload")
//       ) {
//         await fs.unlink(oldImage);
//       } else {
//         console.log("We don't need to remove the old image", oldImage);
//       }

//       //Confirmation back
//       res.status(201).json({
//         message: `Favorite Movie with id= ${id} sucessfully updated ✅`,
//         data: newData,
//       });
//     }
//   } catch (error) {
//     // Handle errors
//     console.error("Error editing Movie ❌:", error);
//     res.status(500).json({ error: "Internal Server Error ❌" });
//   }
// };
