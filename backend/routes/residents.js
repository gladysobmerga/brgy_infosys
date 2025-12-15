const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { body, validationResult } = require('express-validator');

// Get all residents
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM residents';
    let countQuery = 'SELECT COUNT(*) FROM residents';
    const params = [];

    if (search) {
      query += ' WHERE first_name ILIKE $1 OR last_name ILIKE $1';
      countQuery += ' WHERE first_name ILIKE $1 OR last_name ILIKE $1';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY last_name, first_name LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const [residents, count] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, search ? [`%${search}%`] : [])
    ]);

    res.json({
      residents: residents.rows,
      total: parseInt(count.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(count.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Get residents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single resident
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM residents WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get resident error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create resident
router.post('/', [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('dateOfBirth').isDate(),
  body('gender').isIn(['Male', 'Female', 'Other']),
  body('civilStatus').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      firstName, middleName, lastName, suffix, dateOfBirth, placeOfBirth,
      gender, civilStatus, nationality, occupation, contactNumber, email,
      houseNumber, street, purok, voterStatus, pwdStatus, seniorCitizen
    } = req.body;

    const result = await pool.query(
      `INSERT INTO residents (
        first_name, middle_name, last_name, suffix, date_of_birth, place_of_birth,
        gender, civil_status, nationality, occupation, contact_number, email,
        house_number, street, purok, voter_status, pwd_status, senior_citizen
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [firstName, middleName, lastName, suffix, dateOfBirth, placeOfBirth,
       gender, civilStatus, nationality || 'Filipino', occupation, contactNumber, email,
       houseNumber, street, purok, voterStatus || false, pwdStatus || false, seniorCitizen || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create resident error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update resident
router.put('/:id', async (req, res) => {
  try {
    const fields = Object.keys(req.body)
      .filter(key => key !== 'id')
      .map((key, index) => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = $${index + 1}`)
      .join(', ');

    const values = Object.keys(req.body)
      .filter(key => key !== 'id')
      .map(key => req.body[key]);

    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE residents SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update resident error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete resident
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM residents WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Delete resident error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
