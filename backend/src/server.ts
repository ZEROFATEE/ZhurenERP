import express from 'express';
import cors from 'cors';
import pool from '../db';

const app = express();
app.use(cors());
app.use(express.json());

// Test route - get all products
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
  const { vendor, contact, email, account, mailing_address } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO products (sku, name, price, cost_price, stock_qty, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [vendor, contact, email, account, mailing_address, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

