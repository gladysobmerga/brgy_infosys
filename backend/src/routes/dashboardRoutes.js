const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Promise.all([
      query('SELECT COUNT(*) as total FROM residents'),
      query("SELECT COUNT(*) as active FROM residents WHERE status = 'active'"),
      query("SELECT COUNT(*) as total_certs FROM certificates WHERE status = 'active'"),
      query("SELECT COUNT(*) as pending FROM document_requests WHERE status = 'pending'"),
      query('SELECT COUNT(*) as today_certs FROM certificates WHERE issued_date = CURRENT_DATE'),
      query("SELECT COUNT(*) as voters FROM residents WHERE is_voter = true AND status = 'active'"),
      query("SELECT COUNT(*) as seniors FROM residents WHERE is_senior = true AND status = 'active'"),
      query("SELECT COUNT(*) as pwd FROM residents WHERE is_pwd = true AND status = 'active'")
    ]);

    res.json({
      success: true,
      data: {
        residents: {
          total: parseInt(stats[0].rows[0].total),
          active: parseInt(stats[1].rows[0].active),
          voters: parseInt(stats[5].rows[0].voters),
          seniors: parseInt(stats[6].rows[0].seniors),
          pwd: parseInt(stats[7].rows[0].pwd)
        },
        certificates: {
          total: parseInt(stats[2].rows[0].total_certs),
          today: parseInt(stats[4].rows[0].today_certs)
        },
        requests: {
          pending: parseInt(stats[3].rows[0].pending)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/activities', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const activitiesQuery = `
      SELECT al.*, CONCAT(u.first_name, ' ', u.last_name) as user_full_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT $1
    `;

    const result = await query(activitiesQuery, [limit]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/certificates/by-type', async (req, res, next) => {
  try {
    const statsQuery = `
      SELECT ct.name as cert_name, COUNT(c.id) as total_count
      FROM certificate_types ct
      LEFT JOIN certificates c ON ct.id = c.certificate_type_id 
        AND c.issued_date >= CURRENT_DATE - INTERVAL '30 days'
      WHERE ct.is_active = true
      GROUP BY ct.name
      ORDER BY total_count DESC
    `;

    const result = await query(statsQuery);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/certificates/trends', async (req, res, next) => {
  try {
    const trendsQuery = `
      SELECT 
        TO_CHAR(issued_date, 'Mon YYYY') as period_label,
        COUNT(*) as total_issued
      FROM certificates
      WHERE issued_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY TO_CHAR(issued_date, 'Mon YYYY'), DATE_TRUNC('month', issued_date)
      ORDER BY DATE_TRUNC('month', issued_date)
    `;

    const result = await query(trendsQuery);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
