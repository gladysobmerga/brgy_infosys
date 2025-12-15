const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, residentId } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, ct.name as certificate_type_name, 
             CONCAT(r.first_name, ' ', r.last_name) as resident_name,
             CONCAT(u.first_name, ' ', u.last_name) as issued_by_name
      FROM certificates c
      JOIN certificate_types ct ON c.certificate_type_id = ct.id
      JOIN residents r ON c.resident_id = r.id
      LEFT JOIN users u ON c.issued_by = u.id
    `;
    let countQuery = 'SELECT COUNT(*) FROM certificates';
    const params = [];

    if (residentId) {
      query += ' WHERE c.resident_id = $1';
      countQuery += ' WHERE resident_id = $1';
      params.push(residentId);
    }

    query += ' ORDER BY c.issued_date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const [certificates, count] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, residentId ? [residentId] : [])
    ]);

    res.json({
      certificates: certificates.rows,
      total: parseInt(count.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(count.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get certificate types
router.get('/types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM certificate_types WHERE is_active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get certificate types error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create certificate
router.post('/', async (req, res) => {
  try {
    const { certificateTypeId, residentId, purpose, issuedBy, orNumber, amountPaid } = req.body;
    
    const certNumber = `CERT-${Date.now()}`;
    const issuedDate = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `INSERT INTO certificates (certificate_type_id, resident_id, certificate_number, purpose, issued_by, issued_date, amount_paid, or_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [certificateTypeId, residentId, certNumber, purpose, issuedBy, issuedDate, amountPaid || 0, orNumber]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single certificate
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, ct.name as certificate_type_name, ct.description,
              r.*, CONCAT(u.first_name, ' ', u.last_name) as issued_by_name
       FROM certificates c
       JOIN certificate_types ct ON c.certificate_type_id = ct.id
       JOIN residents r ON c.resident_id = r.id
       LEFT JOIN users u ON c.issued_by = u.id
       WHERE c.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
