import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getWalletData(address) {
  const { data } = await axios.get(`${API_BASE}/tracker/${address}`);
  return data;
}