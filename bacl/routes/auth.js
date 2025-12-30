const express = require('express');
const {
  register,
  login,
  seedTables
} = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/seed-tables', seedTables);

module.exports = router;
