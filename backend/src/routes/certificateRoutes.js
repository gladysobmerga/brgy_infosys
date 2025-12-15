const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, residentId, status = 'active' } = req.query;
    const offset = (page - 1) * limit;
    const params = [status];
    let filterClause = 'WHERE c.status = $1';

    if (residentId) {
      params.push(residentId);
      filterClause += ` AND c.resident_id = $${params.length}`;
    }

    const totalQuery = `SELECT COUNT(*) FROM certificates c ${filterClause}`;
    const dataQuery = `
      SELECT c.*, ct.name as cert_type_name, ct.code as cert_code,
             CONCAT(r.first_name, ' ', r.last_name) as resident_full_name,
             CONCAT(u.first_name, ' ', u.last_name) as issuer_name
      FROM certificates c
      INNER JOIN certificate_types ct ON c.certificate_type_id = ct.id
      INNER JOIN residents r ON c.resident_id = r.id
      LEFT JOIN users u ON c.issued_by = u.id
      ${filterClause}
      ORDER BY c.issued_date DESC
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

router.get('/types', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM certificate_types WHERE is_active = true ORDER BY name ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { certificateTypeId, residentId, purpose, validUntil, orNumber, amountPaid, remarks } = req.body;
    const certNo = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const currentDate = new Date().toISOString().split('T')[0];

    const insertQuery = `
      INSERT INTO certificates (
        certificate_no, certificate_type_id, resident_id, purpose, 
        issued_date, valid_until, issued_by, or_number, amount_paid, remarks
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `;

    const result = await query(insertQuery, [
      certNo, certificateTypeId, residentId, purpose, currentDate,
      validUntil, req.user.id, orNumber, amountPaid || 0, remarks
    ]);

    await query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'CERTIFICATE_ISSUED', 'certificate', result.rows[0].id, 
       JSON.stringify({ certNo, residentId })]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const detailQuery = `
      SELECT c.*, ct.name as cert_type_name, ct.code, ct.description,
             r.*, CONCAT(u.first_name, ' ', u.last_name) as issuer_full_name
      FROM certificates c
      INNER JOIN certificate_types ct ON c.certificate_type_id = ct.id
      INNER JOIN residents r ON c.resident_id = r.id
      LEFT JOIN users u ON c.issued_by = u.id
      WHERE c.id = $1
    `;

    const result = await query(detailQuery, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Certificate record not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const updateQuery = 'UPDATE certificates SET status = $1, remarks = $2 WHERE id = $3 RETURNING *';
    const result = await query(updateQuery, [status, remarks, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
