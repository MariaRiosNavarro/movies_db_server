import { dbo } from "../utils/db.js";

export const addMovie = async (req, res) => {
  try {
    // Extract data from the body of the request
    const movie = {
      movieImage: req.body.movieImage,
      movieTitle: req.body.movieTitle,
      movieReleaseYear: Number(req.body.movieReleaseYear),
      movieRuntime: Number(req.body.movieRuntime),
      movieDescription: req.body.movieDescription,
      movieRating: Number(req.body.movieRating),
      movieVoteCount: Number(req.body.movieVoteCount),
      movieGenres: req.body.movieGenres,
      movieLanguage: req.body.movieLanguage,
    };

    // Check if at least the movie.movieTitle is present
    if (!movie.movieTitle) {
      return res.status(400).json({ error: "Title is necessary." });
    }

    // Save the new movie
    const dbResponse = await dbo.collection("movies").insertOne(movie);

    // Send a successful response
    if (dbResponse.acknowledged) {
      res.status(201).json({ message: "Movie successfully added ✅" }).end();
    } else {
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
