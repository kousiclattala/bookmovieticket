const Theater = require("../models/theater");
const Seat = require("../models/seat");
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
    const { theaterName, theaterLocation, noOfScreens, classTypes, layout } =
      req.body;

    const types = classTypes.map((clas) => clas.toLowerCase());

    const theaterSeats = [];

    const theater = await Theater.create({
      theaterName,
      theaterLocation,
      noOfScreens,
      classTypes: types,
    });

    logger.info(theater);

    layout.map(async (item, indx) => {
      item.seats.map((seat) => {
        seat.numbers.map(async (n, idx) => {
          const st = await Seat.create({
            theaterId: theater._id,
            seatNo: n,
            price: item.price,
            class: item.class.toLowerCase(),
          });

          theater.theaterLayout.push(st._id);
        });
      });

      if (indx === layout.length - 1) {
        logger.info(true);
        theater.save().then((theat) => {
          res
            .status(200)
            .json(response(true, 200, "Theater Added Successfully", theat));
        });
      }
    });
  } catch (error) {
    res
      .status(400)
      .json(response(false, 400, "Error in adding theater", error));
  }
};

exports.updateTheaterLayout = async (req, res) => {
  try {
    const { layout, theaterId } = req.body;

    const theaterLayout = [];
    const classSeats = [];
    const classSeatNumbers = [];

    layout.map((item) => {
      item.seats.map((seat) => {
        seat.numbers.map(async (n, idx) => {
          const st = await Seat.create({
            theaterId,
            seatNo: n,
            price: item.price,
            class: item.class,
          });
          classSeatNumbers.push(st);
        });
      });
    });

    logger.info(theaterLayout);

    const theater = await Theater.findByIdAndUpdate(
      { _id: theaterId },
      {
        theaterLayout,
      },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json(
        response(true, 200, "Theater layout updated successfully", theater)
      );
  } catch (error) {
    logger.error(error);
    res
      .status(422)
      .json(response(false, 422, "Error in updating theater layout", error));
  }
};

//TODO: need to work on seating sort response
exports.updateMovieStreamingInTheater = async (req, res) => {
  try {
    const {
      theaterId,
      movieDetails,
      noOfDaysStreaming,
      streamingDates,
      streamingTimings,
    } = req.body;

    const updateResult = await Seat.updateMany(
      { theaterId },
      { movieId: movieDetails }
    );

    const seats = await Seat.find({ theaterId });

    const streaming = {};

    const timingsObj = {};

    streamingTimings.forEach((t) =>
      Object.assign(timingsObj, {
        [t]: seats.sort(),
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

//TODO: need to work on seating arrangement response
exports.getTheaterSeatingArrangement = async (req, res) => {
  try {
    const { theaterId } = req.body;

    const theater = await Theater.findById({ _id: theaterId });

    const layout = await Seat.find({ theaterId });

    const arrangement = {};

    var seats = [];

    theater.classTypes.map((type) => {
      layout.map((lay) => {
        // logger.warn(type == lay.class);

        if (type == lay.class) {
          seats.push(lay);
        }
      });

      Object.assign(arrangement, {
        [type]: {
          seats: seats.sort(),
          row: "A",
        },
      });
      seats = [];
    });

    res.status(200).json(response(true, 200, "Theater seating", arrangement));
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

exports.getTheaterDetails = async (req, res) => {
  try {
    const { theaterId } = req.params;

    if (!theaterId) {
      return res
        .status(404)
        .json(response(false, 404, "Theater Id is missing"));
    }

    const theater = await Theater.findById({ _id: theaterId });

    res
      .status(200)
      .json(response(true, 200, "Theater details fetched", theater));
  } catch (error) {
    res
      .status(422)
      .json(response(false, 422, "Error in getting theater details", error));
  }
};

exports.removeTheaterDetails = async (req, res) => {
  try {
    const { theaterId } = req.params;

    if (!theaterId) {
      return res
        .status(404)
        .json(response(false, 404, "Theater Id is missing"));
    }

    const theater = await Theater.findByIdAndRemove({ _id: theaterId });
    const seats = await Seat.deleteMany({ theaterId });

    res
      .status(200)
      .json(response(true, 200, "Theater details deleted successfully"));
  } catch (error) {
    res
      .status(422)
      .json(response(false, 422, "Error in deleting theater details", error));
  }
};

exports.updateTheaterDetails = async (req, res) => {
  try {
    const { theaterId } = req.params;

    if (!theaterId) {
      return res
        .status(404)
        .json(response(false, 404, "Theater Id is missing"));
    }

    const theater = await Theater.findByIdAndUpdate(
      { _id: theaterId },
      req.body,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json(
        response(true, 200, "Theater details updated successfully", theater)
      );
  } catch (error) {
    res
      .status(422)
      .json(response(false, 422, "Error in updating theater details", error));
  }
};

exports.updateTheaterSeating = async (req, res) => {
  try {
    const { theaterId } = req.params;

    const updateRes = await Seat.updateMany(
      { theaterId },
      {
        bookedDatesAndTimes: {},
      }
    );

    res
      .status(200)
      .json(response(true, 200, "Theater seating updated successfully"));
  } catch (error) {
    res
      .status(422)
      .json(response(false, 422, "Error in updating theater seating", error));
  }
};
