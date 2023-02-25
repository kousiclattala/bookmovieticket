const Theater = require("../models/theater");
const logger = require("../utils/logger");
const { response } = require("../utils/response");

exports.getAllTheater = async (req, res) => {
  try {
    const theaters = await Theater.find({});

    res.status(200).json(response(true, 200, "All theaters", theaters));
  } catch (error) {
    res.status(400).json(false, 400, "Error in getting all theater", error);
  }
};

exports.addTheater = async (req, res) => {
  try {
    const { theaterName, theaterLocation, noOfScreens, theaterLayout } =
      req.body;

    const theater = await Theater.create({
      theaterName,
      theaterLocation,
      noOfScreens,
      theaterLayout,
    });

    res
      .status(200)
      .json(response(true, 200, "Theater Added Successfully", theater));
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in adding theater", error));
  }
};

exports.updateMovieStreamingInTheater = async (req, res) => {
  try {
    const {
      theaterId,
      movieDetails,
      noOfDaysStreaming,
      streamingDates,
      streamingTimings,
    } = req.body;

    const streaming = {};

    const timingsObj = {};

    streamingTimings.forEach((t) =>
      Object.assign(timingsObj, {
        [t]: [],
      })
    );

    streamingDates.forEach((d) =>
      Object.assign(streaming, {
        [d]: timingsObj,
      })
    );

    const theater = await Theater.findByIdAndUpdate(
      { _id: theaterId },
      {
        moviesStreaming: {
          movieDetails,
          noOfDaysStreaming,
          streamingDates,
          streamingTimings,
          showBookingDatesTimings: streaming,
        },
      }
    );

    res
      .status(200)
      .json(
        response(
          true,
          200,
          "Movie streaming details in theater updated successfully",
          theater
        )
      );
  } catch (error) {
    res
      .status(400)
      .json(
        response(
          false,
          400,
          "Error in updating movie streaming in theater",
          error
        )
      );
  }
};

exports.getTheaterSeatingArrangement = async (req, res) => {
  try {
    const { theaterId, showDate, showTiming, movieId } = req.body;

    const theater = await Theater.findById({ _id: theaterId });

    const movies = theater.moviesStreaming;

    movies.map((m) => {
      if (m.movieDetails == movieId) {
        var showBookings = m.showBookingDatesTimings;

        var date = Object.keys(showBookings).filter((k) => {
          if (k == showDate) {
            return k;
          }
        });

        var showdate = showBookings[date];

        var data = {
          layout: theater.theaterLayout,
          bookedSeats: showdate,
        };

        res.status(200).json(response(true, 200, "Seats details", data));
      }
    });
  } catch (error) {
    logger.error(error);
    res
      .status(400)
      .json(
        response(
          false,
          400,
          "Error in getting theater seating arrangement",
          error
        )
      );
  }
};

exports.getTheatersBasedOnMovieAndLocation = async (req, res) => {
  try {
    const { location, movieId } = req.body;

    if (location == null || movieId == null) {
      return res
        .status(404)
        .json(response(false, 404, "Location or movieid is missing"));
    }

    const theaters = await Theater.find({ theaterLocation: location });

    const movieTheaters = [];

    theaters.map((theater) => {
      theater.moviesStreaming.map((movie) => {
        if (movie.movieDetails == movieId) {
          movieTheaters.push(theater);
        }
      });
    });

    res
      .status(200)
      .json(
        response(
          true,
          200,
          "Theater fetched based on location and movie",
          movieTheaters
        )
      );
  } catch (error) {
    res
      .status(400)
      .json(
        response(
          false,
          400,
          "Error in getting theaters based on movie and location",
          error
        )
      );
  }
};
