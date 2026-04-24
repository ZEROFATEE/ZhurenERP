import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Vendor {
  id: number;
  name: string;
  contact?: string;
  mailing_address?: string;
  account?: string;
  email?: string;
  amount: number | string;
  shipping_date?: string;
  date_received?: string;
  created_at?: string;
  updated_at?: string;
  items?: VendorItem[];
}

export interface VendorItem {
  id: number;
  vendor_id: number;
  qty: number;
  name: string;
  date_received?: string;
  shipping_date?: string;
  amount: number;
}

export interface CreateVendorData {
  name: string;
  contact?: string;
  mailing_address?: string;
  account?: string;
  email?: string;
  amount?: number;
  shipping_date?: string;
  date_received?: string;
}

export const getVendors = async (): Promise<Vendor[]> => {
  const response = await axios.get(`${API_URL}/vendors`);
  return response.data;
};

export const getVendor = async (id: number): Promise<Vendor> => {
  const response = await axios.get(`${API_URL}/vendors/${id}`);
  return response.data;
};

export const createVendor = async (data: CreateVendorData): Promise<Vendor> => {
  const response = await axios.post(`${API_URL}/vendors`, data);
  return response.data;
};

export const updateVendor = async (id: number, data: CreateVendorData): Promise<Vendor> => {
  const response = await axios.put(`${API_URL}/vendors/${id}`, data);
  return response.data;
};

export const deleteVendor = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/vendors/${id}`);
};