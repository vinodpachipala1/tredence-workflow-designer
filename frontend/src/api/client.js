import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://tredence-workflow-designer.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;