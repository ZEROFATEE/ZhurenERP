import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'zh_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'zh_db',
  password: process.env.DB_PASSWORD || 'password123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;