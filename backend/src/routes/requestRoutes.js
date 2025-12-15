const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let filterClause = 'WHERE 1=1';

    if (status) {
      params.push(status);
      filterClause += ` AND dr.status = $${params.length}`;
    }
    if (priority) {
      params.push(priority);
      filterClause += ` AND dr.priority = $${params.length}`;
    }

    const totalQuery = `SELECT COUNT(*) FROM document_requests dr ${filterClause}`;
    const dataQuery = `
      SELECT dr.*, 
             CONCAT(r.first_name, ' ', r.last_name) as resident_full_name,
             r.contact_number as resident_phone,
             CONCAT(u.first_name, ' ', u.last_name) as processor_name
      FROM document_requests dr
      INNER JOIN residents r ON dr.resident_id = r.id
      LEFT JOIN users u ON dr.processed_by = u.id
      ${filterClause}
      ORDER BY 
        CASE dr.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'normal' THEN 3 
          ELSE 4 
        END,
        dr.requested_date DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const [countRes, dataRes] = await Promise.all([
      query(totalQuery, params),
      query(dataQuery, [...params, limit, offset])
    ]);

    res.json({
      success: true,
      data: dataRes.rows,
      pagination: {
        total: parseInt(countRes.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countRes.rows[0].count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { residentId, documentType, purpose, priority } = req.body;
    const reqNo = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const insertQuery = `
      INSERT INTO document_requests (request_no, resident_id, document_type, purpose, priority)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;

    const result = await query(insertQuery, [reqNo, residentId, documentType, purpose, priority || 'normal']);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, notes, rejectionReason } = req.body;
    const params = [status, req.user.id, notes];
    let updateQuery = `UPDATE document_requests SET status = $1, processed_by = $2, notes = $3, updated_at = CURRENT_TIMESTAMP`;

    if (status === 'processing' || status === 'approved') {
      updateQuery += ', processed_date = CURRENT_TIMESTAMP';
    }
    if (status === 'completed') {
      updateQuery += ', completed_date = CURRENT_TIMESTAMP';
    }
    if (status === 'rejected' && rejectionReason) {
      params.push(rejectionReason);
      updateQuery += `, rejection_reason = $${params.length}`;
    }

    params.push(req.params.id);
    updateQuery += ` WHERE id = $${params.length} RETURNING *`;

    const result = await query(updateQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Request record not found' });
    }

    await query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'REQUEST_STATUS_UPDATED', 'document_request', result.rows[0].id,
       JSON.stringify({ status, requestNo: result.rows[0].request_no })]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
