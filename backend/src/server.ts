import express from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// PRODUCTS ROUTES
// ============================================

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

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
// VENDOR ROUTES
// ============================================

app.get('/api/vendors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendors ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ /api/vendors/count BEFORE /api/vendors/:id — same ordering rule
app.get('/api/vendors/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM vendors');
    const count = parseInt(result.rows[0].total) || 0;
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ count: 0, error: err.message });
  }
});

app.get('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const vendorResult = await pool.query('SELECT * FROM vendors WHERE id = $1', [id]);
    if (vendorResult.rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
    const itemsResult = await pool.query('SELECT * FROM vendor_items WHERE vendor_id = $1', [id]);
    res.json({ ...vendorResult.rows[0], items: itemsResult.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vendors', async (req, res) => {
  const { name, contact, mailing_address, account, email, amount, shipping_date, date_received } = req.body;
  try {
    if (!name || name.trim() === '') return res.status(400).json({ error: 'Vendor name is required' });
    const result = await pool.query(
      `INSERT INTO vendors (name, contact, mailing_address, account, email, amount, shipping_date, date_received)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name.trim(), contact || null, mailing_address || null, account || null,
       email || null, amount || 0, shipping_date || null,
       date_received || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact, mailing_address, account, email, amount, shipping_date, date_received } = req.body;
  try {
    const result = await pool.query(
      `UPDATE vendors SET name=$1, contact=$2, mailing_address=$3, account=$4,
       email=$5, amount=$6, shipping_date=$7, date_received=$8, updated_at=CURRENT_TIMESTAMP
       WHERE id=$9 RETURNING *`,
      [name, contact, mailing_address, account, email, amount, shipping_date, date_received, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM vendors WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vendors/:id/items', async (req, res) => {
  const { id } = req.params;
  const { qty, name, date_received, shipping_date, amount } = req.body;
  try {
    const vendorCheck = await pool.query('SELECT id FROM vendors WHERE id=$1', [id]);
    if (vendorCheck.rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
    const result = await pool.query(
      `INSERT INTO vendor_items (vendor_id, qty, name, date_received, shipping_date, amount)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, qty || 1, name, date_received, shipping_date, amount || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// PURCHASE ROUTES
// ============================================

app.get('/api/purchases', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM purchases ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/purchases/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM purchases WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Purchase not found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/purchases', async (req, res) => {
  const { qty, item, description, unit_price, amount, total, shipment_date, received_date, status } = req.body;
  try {
    if (!item || item.trim() === '') return res.status(400).json({ error: 'Item name is required' });
    const result = await pool.query(
      `INSERT INTO purchases (qty, item, description, unit_price, amount, total, shipment_date, received_date, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [qty || 1, item.trim(), description || null, unit_price || 0, amount || 0,
       total || 0, shipment_date || null, received_date || null, status || 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/purchases/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await pool.query('SELECT * FROM purchases WHERE id=$1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Purchase not found' });
    const cur = existing.rows[0];
    const b = req.body;
    const merged = {
      qty:           b.qty           ?? cur.qty,
      item:          b.item          ?? cur.item,
      description:   b.description   ?? cur.description,
      unit_price:    b.unit_price    ?? cur.unit_price,
      amount:        b.amount        ?? cur.amount,
      total:         b.total         ?? cur.total,
      shipment_date: b.shipment_date ?? cur.shipment_date,
      received_date: b.received_date ?? cur.received_date,
      status:        b.status        ?? cur.status,
    };
    const result = await pool.query(
      `UPDATE purchases SET qty=$1, item=$2, description=$3, unit_price=$4,
       amount=$5, total=$6, shipment_date=$7, received_date=$8,
       status=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10 RETURNING *`,
      [merged.qty, merged.item, merged.description, merged.unit_price,
       merged.amount, merged.total, merged.shipment_date, merged.received_date,
       merged.status, id]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/purchases/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM purchases WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Purchase not found' });
    res.json({ message: 'Purchase deleted successfully' });
  } catch (err: any) {
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
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM inventory WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(result.rows[0]);
  } catch (err: any) {
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
  try {
    if (!item || item.trim() === '') return res.status(400).json({ error: 'Item code is required' });
    if (!name || name.trim() === '') return res.status(400).json({ error: 'Item name is required' });
    const result = await pool.query(
      `INSERT INTO inventory (item, name, description, item_class, price_level,
        serial_number, last_unit_cost, gl_sales_account, inventory_account,
        gl_cost_of_sales_account, item_tax_type, shipping_date, date_received, amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [item.trim(), name.trim(), description || null, item_class || null, price_level || 0,
       serial_number || null, last_unit_cost || 0, gl_sales_account || null,
       inventory_account || null, gl_cost_of_sales_account || null, item_tax_type || '1',
       shipping_date || null,
       date_received || new Date().toISOString().split('T')[0],
       amount || 0, status || 'NotReceived']
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await pool.query('SELECT * FROM inventory WHERE id=$1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Inventory item not found' });
    const cur = existing.rows[0];
    const b = req.body;
    const merged = {
      item:                     b.item                     ?? cur.item,
      name:                     b.name                     ?? cur.name,
      description:              b.description              ?? cur.description,
      item_class:               b.item_class               ?? cur.item_class,
      price_level:              b.price_level              ?? cur.price_level,
      serial_number:            b.serial_number            ?? cur.serial_number,
      last_unit_cost:           b.last_unit_cost           ?? cur.last_unit_cost,
      gl_sales_account:         b.gl_sales_account         ?? cur.gl_sales_account,
      inventory_account:        b.inventory_account        ?? cur.inventory_account,
      gl_cost_of_sales_account: b.gl_cost_of_sales_account ?? cur.gl_cost_of_sales_account,
      item_tax_type:            b.item_tax_type            ?? cur.item_tax_type,
      shipping_date:            b.shipping_date            ?? cur.shipping_date,
      date_received:            b.date_received            ?? cur.date_received,
      amount:                   b.amount                   ?? cur.amount,
      status:                   b.status                   ?? cur.status,
    };
    const result = await pool.query(
      `UPDATE inventory SET item=$1, name=$2, description=$3, item_class=$4,
       price_level=$5, serial_number=$6, last_unit_cost=$7, gl_sales_account=$8,
       inventory_account=$9, gl_cost_of_sales_account=$10, item_tax_type=$11,
       shipping_date=$12, date_received=$13, amount=$14, status=$15,
       updated_at=CURRENT_TIMESTAMP WHERE id=$16 RETURNING *`,
      [merged.item, merged.name, merged.description, merged.item_class,
       merged.price_level, merged.serial_number, merged.last_unit_cost,
       merged.gl_sales_account, merged.inventory_account,
       merged.gl_cost_of_sales_account, merged.item_tax_type,
       merged.shipping_date, merged.date_received,
       merged.amount, merged.status, id]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM inventory WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Inventory item not found' });
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// PURCHASE → INVENTORY TRANSFER
// ============================================

app.post('/api/purchases/:id/transfer-to-inventory', async (req, res) => {
  const { id } = req.params;
  try {
    const purchaseResult = await pool.query('SELECT * FROM purchases WHERE id=$1', [id]);
    if (purchaseResult.rows.length === 0) return res.status(404).json({ error: 'Purchase not found' });
    const purchase = purchaseResult.rows[0];

    if (purchase.status !== 'Received') {
      return res.status(400).json({ error: 'Purchase must be marked as Received before transferring to inventory' });
    }

    const existingCheck = await pool.query('SELECT id FROM inventory WHERE item=$1', [purchase.item]);
    if (existingCheck.rows.length > 0) return res.status(409).json({ error: 'This item already exists in inventory' });

    // ✅ FIXED: generate next FIFO serial number so transferred purchases
    //    get a serial_number instead of null, making them visible in Sales tab
    const serialResult = await pool.query(
      `SELECT serial_number FROM inventory WHERE serial_number ~ '^SN-[0-9]+$'`
    );
    const usedSerials = new Set<number>(
      serialResult.rows
        .map((r: any) => parseInt(r.serial_number.replace('SN-', ''), 10))
        .filter((n: number) => !isNaN(n))
    );
    let nextSerial = 1;
    while (usedSerials.has(nextSerial)) nextSerial++;
    const serialNumber = `SN-${String(nextSerial).padStart(3, '0')}`;

    const result = await pool.query(
      `INSERT INTO inventory (item, name, description, item_class, price_level,
        serial_number, last_unit_cost, gl_sales_account, inventory_account,
        gl_cost_of_sales_account, item_tax_type, shipping_date, date_received, amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [
        purchase.item,
        purchase.description || purchase.item,
        purchase.description || null,
        null,                    // item_class — not stored on purchases, will show "No class" in Sales
        purchase.unit_price || 0,
        serialNumber,            // ✅ auto-assigned FIFO serial instead of null
        purchase.unit_price || 0,
        null,
        null,
        null,
        '1',
        purchase.shipment_date || null,
        purchase.received_date || new Date().toISOString().split('T')[0],
        purchase.amount || 0,
        'Received'
      ]
    );

    res.status(201).json({
      message: 'Purchase successfully transferred to inventory',
      inventory: result.rows[0]
    });
  } catch (err: any) {
    console.error('POST transfer-to-inventory ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/purchases/:id/transfer-to-inventory', async (req, res) => {
  const { id } = req.params;
  try {
    const purchaseResult = await pool.query('SELECT * FROM purchases WHERE id=$1', [id]);
    if (purchaseResult.rows.length === 0) return res.status(404).json({ error: 'Purchase not found' });
    const purchase = purchaseResult.rows[0];
    const deleteResult = await pool.query('DELETE FROM inventory WHERE item=$1 RETURNING *', [purchase.item]);
    if (deleteResult.rows.length === 0) return res.status(404).json({ error: 'Item not found in inventory' });
    res.json({ message: 'Item removed from inventory successfully', removed: deleteResult.rows[0] });
  } catch (err: any) {
    console.error('DELETE transfer-to-inventory ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// SALES ROUTES
// ✅ specific routes BEFORE /:id — prevents "available-items" matching :id
// ============================================

app.get('/api/sales/available-items', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        i.*,
        s.customer_id,
        v.name as customer_name,
        s.date_sold
      FROM inventory i
      LEFT JOIN sales s ON i.id = s.item_id
      LEFT JOIN vendors v ON s.customer_id = v.id
      WHERE i.status = 'Received'
      ORDER BY i.serial_number ASC`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('GET /api/sales/available-items ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// SALES ROUTES
// ============================================

// GET sales by customer (purchase history)
app.get('/api/sales/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query(
      `SELECT s.*, v.name as customer_name 
       FROM sales s 
       JOIN vendors v ON s.customer_id = v.id 
       WHERE s.customer_id = $1 
       ORDER BY s.date_sold DESC, s.created_at DESC`,
      [customerId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('GET /api/sales/customer/:customerId ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST create sale
app.post('/api/sales', async (req, res) => {
  const {
    customer_id, item_id, item_code, item_name,
    serial_number, qty, price_level, amount, date_sold
  } = req.body;

  try {
    if (!customer_id) return res.status(400).json({ error: 'Customer is required' });
    if (!item_id) return res.status(400).json({ error: 'Item is required' });
    if (!serial_number) return res.status(400).json({ error: 'Serial number is required' });

    // Verify customer exists
    const customerCheck = await pool.query('SELECT id FROM vendors WHERE id = $1', [customer_id]);
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Verify inventory item exists and is available
    const itemCheck = await pool.query(
      'SELECT * FROM inventory WHERE id = $1 AND status = $2',
      [item_id, 'Received']
    );
    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Item not available or already sold' });
    }

    // Create sale record
    const result = await pool.query(
      `INSERT INTO sales (customer_id, item_id, item_code, item_name, serial_number, qty, price_level, amount, date_sold)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [customer_id, item_id, item_code, item_name, serial_number, qty || 1, price_level, amount, date_sold || new Date().toISOString().split('T')[0]]
    );

    // Update inventory status to 'Sold' or remove it
    await pool.query(
      "UPDATE inventory SET status = 'NotReceived' WHERE id = $1",
      [item_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('POST /api/sales ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});