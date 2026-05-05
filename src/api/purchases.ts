import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Purchase {
  id: number;
  qty: number;
  item: string;
  description?: string;
  unit_price: number | string;
  amount: number | string;
  total: number | string;
  shipment_date?: string;
  received_date?: string;
  status: "Received" | "Pending" | "NotReceived";
  created_at?: string;
  updated_at?: string;
}

export interface CreatePurchaseData {
  qty: number;
  item: string;
  description?: string;
  unit_price: number;
  amount: number;
  total: number;
  shipment_date?: string;
  received_date?: string;
  status?: "Received" | "Pending" | "NotReceived";
}

export const getPurchases = async (): Promise<Purchase[]> => {
  const response = await axios.get(`${API_URL}/purchases`);
  return response.data;
};

export const getPurchase = async (id: number): Promise<Purchase> => {
  const response = await axios.get(`${API_URL}/purchases/${id}`);
  return response.data;
};

export const createPurchase = async (data: CreatePurchaseData): Promise<Purchase> => {
  const response = await axios.post(`${API_URL}/purchases`, data);
  return response.data;
};

export const updatePurchase = async (id: number, data: Partial<CreatePurchaseData>): Promise<Purchase> => {
  const response = await axios.put(`${API_URL}/purchases/${id}`, data);
  return response.data;
};

export const deletePurchase = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/purchases/${id}`);
};

export const transferPurchaseToInventory = async (
  id: number
): Promise<{ message: string; inventory: any }> => {
  const response = await axios.post(
    `${API_URL}/purchases/${id}/transfer-to-inventory`
  )
  return response.data
}
export const removePurchaseFromInventory = async (
  id: number
): Promise<{ message: string }> => {
  const response = await axios.delete(
    `${API_URL}/purchases/${id}/transfer-to-inventory`
  )
  return response.data
}