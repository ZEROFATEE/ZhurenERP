import axios from 'axios';
import type { Inventory } from './inventory';

const API_URL = 'http://localhost:5000/api';

// Received inventory items available for sale
export type SaleableItem = Inventory & { status: 'Received' };

export interface Sale {
  id: number;
  inventory_id?: number;
  item: string;
  name: string;
  qty: number;
  unit_price: number | string;
  amount: number | string;
  customer?: string;
  status: 'Paid' | 'Pending' | 'Cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface CreateSaleData {
  inventory_id?: number;
  item: string;
  name?: string;
  qty: number;
  unit_price: number;
  amount: number;
  customer?: string;
  status?: 'Paid' | 'Pending' | 'Cancelled';
}

// ✅ Received inventory items — what shows up in the sales item picker
export const getAvailableItems = async (): Promise<SaleableItem[]> => {
  const response = await axios.get(`${API_URL}/sales/available-items`);
  return response.data;
};

export const getSales = async (): Promise<Sale[]> => {
  const response = await axios.get(`${API_URL}/sales`);
  return response.data;
};

export const getSale = async (id: number): Promise<Sale> => {
  const response = await axios.get(`${API_URL}/sales/${id}`);
  return response.data;
};

export const createSale = async (data: CreateSaleData): Promise<Sale> => {
  const response = await axios.post(`${API_URL}/sales`, data);
  return response.data;
};

export const updateSale = async (id: number, data: Partial<CreateSaleData>): Promise<Sale> => {
  const response = await axios.patch(`${API_URL}/sales/${id}`, data);
  return response.data;
};

export const deleteSale = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/sales/${id}`);
};