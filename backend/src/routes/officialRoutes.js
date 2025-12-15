const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/current', async (req, res, next) => {
  try {
    const officialsQuery = `
      SELECT bo.*, 
             CONCAT(r.first_name, ' ', COALESCE(r.middle_name || ' ', ''), r.last_name) as complete_name,
             r.contact_number, r.email, r.profile_photo
      FROM barangay_officials bo
      INNER JOIN residents r ON bo.resident_id = r.id
      WHERE bo.is_current = true
      ORDER BY bo.order_no NULLS LAST, bo.position
    `;

    const result = await query(officialsQuery);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const historyQuery = `
      SELECT bo.*, CONCAT(r.first_name, ' ', r.last_name) as complete_name
      FROM barangay_officials bo
      INNER JOIN residents r ON bo.resident_id = r.id
      ORDER BY bo.term_start DESC, bo.position
    `;

    const result = await query(historyQuery);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', authorize('admin'), async (req, res, next) => {
  try {
    const { residentId, position, committee, termStart, termEnd, orderNo } = req.body;

    const insertQuery = `
      INSERT INTO barangay_officials (resident_id, position, committee, term_start, term_end, order_no)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;

    const result = await query(insertQuery, [residentId, position, committee, termStart, termEnd, orderNo]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const { position, committee, termStart, termEnd, isCurrent, orderNo } = req.body;

    const updateQuery = `
      UPDATE barangay_officials 
      SET position = $1, committee = $2, term_start = $3, term_end = $4, 
          is_current = $5, order_no = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 
      RETURNING *
    `;

    const result = await query(updateQuery, [position, committee, termStart, termEnd, isCurrent, orderNo, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Official record not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/end-term', authorize('admin'), async (req, res, next) => {
  try {
    const { termEnd } = req.body;
    const endDate = termEnd || new Date().toISOString().split('T')[0];

    const updateQuery = `
      UPDATE barangay_officials 
      SET term_end = $1, is_current = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 
      RETURNING *
    `;

    const result = await query(updateQuery, [endDate, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Official not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
