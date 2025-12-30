const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

// GET all reservations (admin)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("table")
      .sort({ date: -1 });

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET reservations by date (admin)
const getReservationsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);

    const reservations = await Reservation.find({ date })
      .populate("user", "name email")
      .populate("table")
      .sort({ timeSlot: 1 });

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// CANCEL reservation (admin)
const cancelReservationByAdmin = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ msg: "Reservation not found" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    res.json({ msg: "Reservation cancelled by admin" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE reservation (admin)
const updateReservationByAdmin = async (req, res) => {
  try {
    const { date, timeSlot, guests, status } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ msg: "Reservation not found" });
    }

    if (date) reservation.date = new Date(date);
    if (timeSlot) reservation.timeSlot = timeSlot;
    if (guests) reservation.guests = guests;
    if (status) reservation.status = status;

    await reservation.save();
    await reservation.populate("user", "name email");
    await reservation.populate("table");

    res.json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET all tables (admin)
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// CREATE table (admin)
const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      return res
        .status(400)
        .json({ msg: "Please provide tableNumber and capacity" });
    }

    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ msg: "Table number already exists" });
    }

    const table = new Table({ tableNumber, capacity });
    await table.save();

    res.json(table);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE table (admin)
const updateTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ msg: "Table not found" });
    }

    if (tableNumber) table.tableNumber = tableNumber;
    if (capacity) table.capacity = capacity;

    await table.save();
    res.json(table);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE table (admin)
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ msg: "Table not found" });
    }

    const activeReservation = await Reservation.findOne({
      table: req.params.id,
      status: "active",
    });

    if (activeReservation) {
      return res
        .status(400)
        .json({ msg: "Cannot delete table with active reservations" });
    }

    await table.deleteOne();
    res.json({ msg: "Table deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getAllReservations,
  getReservationsByDate,
  cancelReservationByAdmin,
  updateReservationByAdmin,
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
};
