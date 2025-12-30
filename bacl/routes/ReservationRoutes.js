const express = require("express");
const { auth } = require("../middleware/auth");
const reservationController = require("../controllers/ReservationController");

const router = express.Router();

router.get("/available", auth, reservationController.getAvailableTables);

router.post("/", auth, reservationController.createReservation);

router.get("/myres", auth, reservationController.getMyReservations);

router.delete("/:id", auth, reservationController.cancelReservation);

module.exports = router;
