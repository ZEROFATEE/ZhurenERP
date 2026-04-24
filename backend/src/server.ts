import express from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// PRODUCTS ROUTES
// ============================================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a product
app.post('/api/products', async (req, res) => {
  const { sku, name, price, cost_price, stock_qty, category_id } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO products (sku, name, price, cost_price, stock_qty, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [sku, name, price, cost_price, stock_qty, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// ============================================
// VENDOR ROUTES — ONLY ONE OF EACH
// ============================================

// GET all vendors
app.get('/api/vendors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendors ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    console.error('GET /api/vendors ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET single vendor with items
app.get('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const vendorResult = await pool.query('SELECT * FROM vendors WHERE id = $1', [id]);
    if (vendorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    const itemsResult = await pool.query('SELECT * FROM vendor_items WHERE vendor_id = $1', [id]);
    res.json({ ...vendorResult.rows[0], items: itemsResult.rows });
  } catch (err: any) {
    console.error('GET /api/vendors/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST create vendor — ONLY ONE
app.post('/api/vendors', async (req, res) => {
  const { name, contact, mailing_address, account, email, amount, shipping_date, date_received } = req.body;
  
  console.log('POST /api/vendors received:', req.body);
  
  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Vendor name is required' });
    }

    const result = await pool.query(
      `INSERT INTO vendors (name, contact, mailing_address, account, email, amount, shipping_date, date_received) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        name.trim(),
        contact || null,
        mailing_address || null,
        account || null,
        email || null,
        amount || 0,
        shipping_date || null,
        date_received || new Date().toISOString().split('T')[0]
      ]
    );
    
    console.log('Vendor created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('POST /api/vendors ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT update vendor
app.put('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact, mailing_address, account, email, amount, shipping_date, date_received } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE vendors 
       SET name = $1, contact = $2, mailing_address = $3, account = $4, 
           email = $5, amount = $6, shipping_date = $7, date_received = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 
       RETURNING *`,
      [name, contact, mailing_address, account, email, amount, shipping_date, date_received, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('PUT /api/vendors/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE vendor
app.delete('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM vendors WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/vendors/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST add item to vendor — FIXED: was missing :id in path
app.post('/api/vendors/:id/items', async (req, res) => {
  const { id } = req.params;
  const { qty, name, date_received, shipping_date, amount } = req.body;
  
  try {
    // Check if vendor exists
    const vendorCheck = await pool.query('SELECT id FROM vendors WHERE id = $1', [id]);
    if (vendorCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    const result = await pool.query(
      `INSERT INTO vendor_items (vendor_id, qty, name, date_received, shipping_date, amount) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [id, qty || 1, name, date_received, shipping_date, amount || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('POST /api/vendors/:id/items ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});