const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Get all requests
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, CONCAT(res.first_name, ' ', res.last_name) as resident_name,
             CONCAT(u.first_name, ' ', u.last_name) as processed_by_name
      FROM requests r
      JOIN residents res ON r.resident_id = res.id
      LEFT JOIN users u ON r.processed_by = u.id
    `;
    let countQuery = 'SELECT COUNT(*) FROM requests';
    const params = [];

    if (status) {
      query += ' WHERE r.status = $1';
      countQuery += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY r.requested_date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const [requests, count] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, status ? [status] : [])
    ]);

    res.json({
      requests: requests.rows,
      total: parseInt(count.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(count.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create request
router.post('/', async (req, res) => {
  try {
    const { residentId, requestType, description, priority } = req.body;

    const result = await pool.query(
      `INSERT INTO requests (resident_id, request_type, description, priority)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [residentId, requestType, description, priority || 'normal']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update request status
router.patch('/:id', async (req, res) => {
  try {
    const { status, processedBy, notes } = req.body;

    const result = await pool.query(
      `UPDATE requests 
       SET status = $1, processed_by = $2, notes = $3, processed_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [status, processedBy, notes, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
