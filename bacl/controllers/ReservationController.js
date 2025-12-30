const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// GET /available-tables
const getAvailableTables = async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.query;

    const suitableTables = await Table.find({
      capacity: { $gte: guests }
    });

    const existingReservations = await Reservation.find({
      date: new Date(date),
      timeSlot,
      status: 'active'
    }).select('table');

    const bookedTableIds = existingReservations.map(r =>
      r.table.toString()
    );

    const availableTables = suitableTables.filter(
      table => !bookedTableIds.includes(table._id.toString())
    );

    res.json(availableTables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// POST /
const createReservation = async (req, res) => {
  try {
    const { tableId, date, timeSlot, guests } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    if (table.capacity < guests) {
      return res.status(400).json({ msg: 'Table capacity insufficient' });
    }

    const existingReservation = await Reservation.findOne({
      table: tableId,
      date: new Date(date),
      timeSlot,
      status: 'active'
    });

    if (existingReservation) {
      return res
        .status(400)
        .json({ msg: 'Table already booked for this time slot' });
    }

    const reservation = new Reservation({
      user: req.user.id,
      table: tableId,
      date: new Date(date),
      timeSlot,
      guests
    });

    await reservation.save();
    await reservation.populate('table');

    res.json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET /my-reservations
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user.id
    })
      .populate('table')
      .sort({ date: -1 });

    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// DELETE /:id
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ msg: 'Reservation cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getAvailableTables,
  createReservation,
  getMyReservations,
  cancelReservation
};
