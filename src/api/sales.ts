import axios from 'axios';
import type { Inventory } from './inventory';

const API_URL = 'http://localhost:5000/api';

// Sales tab shows inventory items with status = 'Received'
// PLUS customer info if the item was sold
export type SaleableItem = Inventory & {
  status: 'Received';
  customer_id?: number;
  customer_name?: string;
  date_sold?: string;
};

export const getAvailableItems = async (): Promise<SaleableItem[]> => {
  const response = await axios.get(`${API_URL}/sales/available-items`);
  return response.data;
};

export interface SaleRecord {
  id: number;
  customer_id: number;
  customer_name: string;
  item_id: number;
  item_code: string;
  item_name: string;
  serial_number: string;
  qty: number;
  price_level: number;
  amount: number;
  date_sold: string;
  created_at?: string;
}

export const getSalesByCustomer = async (customerId: number): Promise<SaleRecord[]> => {
  const response = await axios.get(`${API_URL}/sales/customer/${customerId}`);
  return response.data;
};

export const createSale = async (data: {
  customer_id: number;
  item_id: number;
  item_code: string;
  item_name: string;
  serial_number: string;
  qty: number;
  price_level: number;
  amount: number;
  date_sold: string;
}): Promise<SaleRecord> => {
  const response = await axios.post(`${API_URL}/sales`, data);
  return response.data;
};