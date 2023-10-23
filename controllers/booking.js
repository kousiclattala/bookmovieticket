const Booking = require("../models/bookings");
const Seat = require("../models/seat");
const logger = require("../utils/logger");
const { response } = require("../utils/response");

exports.createBooking = async (req, res) => {
  try {
    const {
      movieDetails,
      ticket,
      amount,
      subtotal,
      totaltax,
      discountAmount,
      paymentStatus,
      bookingStatus,
    } = req.body;

    const { theater, seats, timing, date } = ticket;

    var status = [];

    var resp = seats.map(async (seat) => {
      var seatRes = await Seat.findOne({ _id: seat });
      var bookedDateTime = seatRes.bookedDatesAndTimes;

      var bookedDate = Object.keys(bookedDateTime).find((k) => k == date);

      if (bookedDate == undefined) {
        var times = [];
        times.push(timing);

        Object.assign(bookedDateTime, {
          [date]: times,
        });

        seatRes.bookedDatesAndTimes = bookedDateTime;

        await Seat.findByIdAndUpdate(
          { _id: seat },
          { bookedDatesAndTimes: bookedDateTime }
        );
        status.push("notThere");
      } else {
        var timesArray = bookedDateTime[date];
        var isTime = timesArray.find((t) => t == timing);

        if (isTime == undefined) {
          bookedDateTime[date].push(timing);

          seatRes.bookedDatesAndTimes = bookedDateTime;

          console.log(bookedDateTime);

          await Seat.findByIdAndUpdate(
            { _id: seat },
            {
              bookedDatesAndTimes: bookedDateTime,
            }
          );
          status.push("notThere");
        } else {
          status.push("isThere");
        }
      }
    });

    //TODO: create booking issue, booking was creating eventhough it is already booked

    setTimeout(async () => {
      console.log(status);

      var isFound = status.includes("isThere");

      logger.info(isFound);

      if (isFound) {
        res.status(400).json(response(false, 400, "Seat already booked"));
      } else {
        const booking = await Booking.create({
          movieDetails,
          ticket,
          user: req.user._id,
          amount,
          subtotal,
          totaltax,
          discountAmount,
          paymentStatus,
          bookingStatus,
        });

        res
          .status(200)
          .json(response(true, 200, "Ticket is booked successfully", booking));
      }
    }, 1000);
  } catch (error) {
    logger.error(error);
    res
      .status(422)
      .json(response(false, 422, "Error in creating booking", error));
  }
};

exports.getSingleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ _id: bookingId })
      .populate("user")
      .exec();

    res.status(200).json(response(true, 200, "Booking fetched", booking));
  } catch (error) {
    res.status(422).json(response(false, 422, "Server Error", error));
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndRemove({ _id: bookingId });

    res.status(200).json(response(true, 200, "Booking deleted successfully"));
  } catch (error) {
    res.status(422).json(response(false, 422, "Server Error", error));
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById({ _id: bookingId });

    const { timing, date, seats } = booking.ticket;

    var resp = seats.map(async (seat) => {
      var seatRes = await Seat.findOne({ _id: seat });
      var bookedDateTime = seatRes.bookedDatesAndTimes;

      var bookedDate = Object.keys(bookedDateTime).find((k) => k == date);

      if (bookedDate == undefined) {
        return false;
      } else {
        var timesArray = bookedDateTime[date];
        var isTime = timesArray.find((t) => t == timing);

        if (isTime == undefined) {
          return false;
        } else {
          bookedDateTime[date].pop(timing);

          seatRes.bookedDatesAndTimes = bookedDateTime;

          console.log(bookedDateTime);

          await Seat.findByIdAndUpdate(
            { _id: seat },
            {
              bookedDatesAndTimes: bookedDateTime,
            }
          );
        }
      }
    });

    const isDataFalse = async (currentValue) => (await currentValue) == false;

    console.log(resp.every(isDataFalse));

    var isBooked = resp.every(isDataFalse);

    if (isBooked) {
      res.status(400).json(response(false, 400, "Seat already cancelled"));
    } else {
      booking.bookingStatus = "cancelled";

      await booking.save();

      res
        .status(200)
        .json(response(true, 200, "Ticket cancelled successfully", booking));
    }
  } catch (error) {
    res
      .status(422)
      .json(response(false, 422, "Error in cancelling booking", error));
  }
};
