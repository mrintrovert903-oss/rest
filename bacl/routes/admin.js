const express = require("express");
const { auth, adminAuth } = require("../middleware/auth");
const adminController = require("../controllers/AdminController");

const router = express.Router();

// Reservations
router.get("/reservations",auth,adminAuth,adminController.getAllReservations);

router.get(
  "/reservations/date/:date",
  auth,
  adminAuth,
  adminController.getReservationsByDate
);

router.delete(
  "/reservations/:id",
  auth,
  adminAuth,
  adminController.cancelReservationByAdmin
);

router.put(
  "/reservations/:id",
  auth,
  adminAuth,
  adminController.updateReservationByAdmin
);

// Tables
router.get("/tables", auth, adminAuth, adminController.getAllTables);

router.post("/tables", auth, adminAuth, adminController.createTable);

router.put("/tables/:id", auth, adminAuth, adminController.updateTable);

router.delete("/tables/:id", auth, adminAuth, adminController.deleteTable);

module.exports = router;
