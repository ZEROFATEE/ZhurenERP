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

// GET vendor count (for auto-generating account numbers)
app.get('/api/vendors/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM vendors');
    const count = parseInt(result.rows[0].total) || 0;
    console.log('Vendor count:', count); // DEBUG
    res.json({ count });
  } catch (err: any) {
    console.error('GET /api/vendors/count ERROR:', err.message);
    res.status(500).json({ count: 0, error: err.message });
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
// PURCHASE ROUTES
// ============================================

// GET all purchases
app.get('/api/purchases', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM purchases ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    console.error('GET /api/purchases ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET single purchase
app.get('/api/purchases/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM purchases WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('GET /api/purchases/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST create purchase
app.post('/api/purchases', async (req, res) => {
  const { qty, item, description, unit_price, amount, total, shipment_date, received_date, status } = req.body;
  
  console.log('POST /api/purchases received:', req.body);
  
  try {
    if (!item || item.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const result = await pool.query(
      `INSERT INTO purchases (qty, item, description, unit_price, amount, total, shipment_date, received_date, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        qty || 1,
        item.trim(),
        description || null,
        unit_price || 0,
        amount || 0,
        total || 0,
        shipment_date || null,
        received_date || null,
        status || 'Pending'
      ]
    );
    
    console.log('Purchase created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('POST /api/purchases ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT update purchase (including status)
app.put('/api/purchases/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // 1. Fetch existing record
    const existing = await pool.query('SELECT * FROM purchases WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const current = existing.rows[0];
    const body = req.body;

    // 2. Merge: use incoming value, fallback to existing
    const merged = {
      qty:             body.qty             ?? current.qty,
      item:            body.item            ?? current.item,
      description:     body.description     ?? current.description,
      unit_price:      body.unit_price      ?? current.unit_price,
      amount:          body.amount          ?? current.amount,
      total:           body.total           ?? current.total,
      shipment_date:   body.shipment_date   ?? current.shipment_date,
      received_date:   body.received_date   ?? current.received_date,
      status:          body.status          ?? current.status,
    };

    // 3. Update with merged values
    const result = await pool.query(
      `UPDATE purchases 
       SET qty = $1, item = $2, description = $3, unit_price = $4, 
           amount = $5, total = $6, shipment_date = $7, received_date = $8,
           status = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 
       RETURNING *`,
      [
        merged.qty, merged.item, merged.description, merged.unit_price,
        merged.amount, merged.total, merged.shipment_date, merged.received_date,
        merged.status, id
      ]
    );

    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('PUT /api/purchases/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE purchase
app.delete('/api/purchases/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM purchases WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json({ message: 'Purchase deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/purchases/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// INVENTORY ROUTES
// ============================================

app.get('/api/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    console.error('GET /api/inventory ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM inventory WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('GET /api/inventory/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  const {
    item, name, description, item_class, price_level,
    serial_number, last_unit_cost, gl_sales_account,
    inventory_account, gl_cost_of_sales_account,
    item_tax_type, shipping_date, date_received, amount, status
  } = req.body;
  console.log('POST /api/inventory received:', req.body);
  try {
    if (!item || item.trim() === '') {
      return res.status(400).json({ error: 'Item code is required' });
    }
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }
    const result = await pool.query(
      `INSERT INTO inventory (
        item, name, description, item_class, price_level,
        serial_number, last_unit_cost, gl_sales_account,
        inventory_account, gl_cost_of_sales_account,
        item_tax_type, shipping_date, date_received, amount, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ) RETURNING *`,
      [
        item.trim(), name.trim(), description || null,
        item_class || null, price_level || 0,
        serial_number || null, last_unit_cost || 0,
        gl_sales_account || null, inventory_account || null,
        gl_cost_of_sales_account || null, item_tax_type || '1',
        shipping_date || null,
        date_received || new Date().toISOString().split('T')[0],
        amount || 0, status || 'NotReceived'
      ]
    );
    console.log('Inventory item created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('POST /api/inventory ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIXED: Fetch existing record first, merge with incoming body so partial updates never wipe data
app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await pool.query('SELECT * FROM inventory WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const current = existing.rows[0];
    const body = req.body;

    const merged = {
      item:                     body.item                     ?? current.item,
      name:                     body.name                     ?? current.name,
      description:              body.description              ?? current.description,
      item_class:               body.item_class               ?? current.item_class,
      price_level:              body.price_level              ?? current.price_level,
      serial_number:            body.serial_number            ?? current.serial_number,
      last_unit_cost:           body.last_unit_cost           ?? current.last_unit_cost,
      gl_sales_account:         body.gl_sales_account         ?? current.gl_sales_account,
      inventory_account:        body.inventory_account        ?? current.inventory_account,
      gl_cost_of_sales_account: body.gl_cost_of_sales_account ?? current.gl_cost_of_sales_account,
      item_tax_type:            body.item_tax_type            ?? current.item_tax_type,
      shipping_date:            body.shipping_date            ?? current.shipping_date,
      date_received:            body.date_received            ?? current.date_received,
      amount:                   body.amount                   ?? current.amount,
      status:                   body.status                   ?? current.status,
    }

    const result = await pool.query(
      `UPDATE inventory
       SET item = $1, name = $2, description = $3, item_class = $4,
           price_level = $5, serial_number = $6, last_unit_cost = $7,
           gl_sales_account = $8, inventory_account = $9,
           gl_cost_of_sales_account = $10, item_tax_type = $11,
           shipping_date = $12, date_received = $13, amount = $14,
           status = $15, updated_at = CURRENT_TIMESTAMP
       WHERE id = $16
       RETURNING *`,
      [
        merged.item, merged.name, merged.description, merged.item_class,
        merged.price_level, merged.serial_number, merged.last_unit_cost,
        merged.gl_sales_account, merged.inventory_account,
        merged.gl_cost_of_sales_account, merged.item_tax_type,
        merged.shipping_date, merged.date_received,
        merged.amount, merged.status, id
      ]
    );

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('PUT /api/inventory/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/inventory/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

