const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Get all current officials
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, CONCAT(r.first_name, ' ', r.last_name) as name, r.contact_number, r.email
       FROM officials o
       JOIN residents r ON o.resident_id = r.id
       WHERE o.is_current = true
       ORDER BY o.position`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get officials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create official
router.post('/', async (req, res) => {
  try {
    const { residentId, position, termStart, termEnd } = req.body;

    const result = await pool.query(
      `INSERT INTO officials (resident_id, position, term_start, term_end)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [residentId, position, termStart, termEnd]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create official error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
