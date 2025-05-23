import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URI;
const authHeaders = () => ({ 
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  timeout: 10000 // Add timeout
});

export const imageService = {
  async getUserImages() {
    const response = await axios.get(`${API_URL}/generate/gallery`, authHeaders());
    return response.data.images;
  },

  async deleteImage(imageId) {
    const response = await axios.delete(`${API_URL}/generate/${imageId}`, authHeaders());
    return response.data;
  }
};