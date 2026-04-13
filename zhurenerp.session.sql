CREATE TABLE purchases (
  id              SERIAL PRIMARY KEY,
  qty             INTEGER NOT NULL DEFAULT 1,
  item            VARCHAR(255) NOT NULL,
  description     TEXT,
  unit_price      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount          NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total           NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shipment_date   DATE,
  received_date   DATE,
  status          VARCHAR(20) DEFAULT 'NotReceived' CHECK (status IN ('Received', 'Pending', 'NotReceived')),
  created_at      TIMESTAMP DEFAULT NOW()
);