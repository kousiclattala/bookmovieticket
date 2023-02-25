const Movies = require("../models/movie");
const logger = require("../utils/logger");
const { response } = require("../utils/response");

//* super admin movie controller
exports.addMovieDetails = async (req, res) => {
  try {
    const { movieName, cast, locations, languages, description } = req.body;

    const movie = await Movies.create({
      movieName,
      cast,
      locations,
      languages,
      description,
    });

    res
      .status(200)
      .json(response(true, 200, "Movie Added Successfully", movie));
  } catch (error) {
    logger.error(error);
    res
      .status(400)
      .json(response(false, 400, "Add movie details is not working", error));
  }
};

//* user movie controller
exports.getMoviesBasedonLocation = async (req, res) => {
  try {
    const { locationName } = req.params;

    if (locationName == null || locationName == undefined) {
      return res
        .status(404)
        .json(response(false, 404, "Please enter valid movie name"));
    }

    const movies = await Movies.find({ locations: locationName });

    res
      .status(200)
      .json(
        response(
          true,
          200,
          `Movies showing in your location: ${locationName}`,
          movies
        )
      );
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in getMoviesBasedonLocation"));
  }
};
