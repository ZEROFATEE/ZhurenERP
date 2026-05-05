import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Inventory {
  id: number;
  item: string;
  name: string;
  description?: string;
  item_class?: string;
  price_level: number | string;
  serial_number?: string;
  last_unit_cost?: number | string;
  gl_sales_account?: string;
  inventory_account?: string;
  gl_cost_of_sales_account?: string;
  item_tax_type: "1" | "2";
  shipping_date?: string;
  date_received?: string;
  amount: number | string;
  status: "Received" | "NotReceived";
  created_at?: string;
  updated_at?: string;
}

export interface CreateInventoryData {
  item: string;
  name: string;
  description?: string;
  item_class?: string;
  price_level: number;
  serial_number?: string;
  last_unit_cost?: number;
  gl_sales_account?: string;
  inventory_account?: string;
  gl_cost_of_sales_account?: string;
  item_tax_type: "1" | "2";
  shipping_date?: string;
  date_released?: string;
  amount: number;
  status?: "Received" | "NotReceived";
}

export const getInventories = async (): Promise<Inventory[]> => {
  const response = await axios.get(`${API_URL}/inventory`);
  return response.data;
};

export const getInventory = async (id: number): Promise<Inventory> => {
  const response = await axios.get(`${API_URL}/inventory/${id}`);
  return response.data;
};

export const createInventory = async (data: CreateInventoryData): Promise<Inventory> => {
  const response = await axios.post(`${API_URL}/inventory`, data);
  return response.data;
};

export const updateInventory = async (id: number, data: Partial<CreateInventoryData>): Promise<Inventory> => {
  const response = await axios.put(`${API_URL}/inventory/${id}`, data);
  return response.data;
};

export const deleteInventory = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/inventory/${id}`);
};