import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const imageService = {
  async getUserImages() {
    const response = await axios.get(`${API_URL}/generate/gallery`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.images;
  },

  async deleteImage(imageId) {
    const response = await axios.delete(`${API_URL}/generate/${imageId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};