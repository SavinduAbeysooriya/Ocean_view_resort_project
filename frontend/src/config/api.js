// Centralized API configuration for Ocean View Resort Frontend

const SERVER_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
const API_URL = import.meta.env.VITE_API_BASE_URL || `${SERVER_URL}/api`;

export { SERVER_URL as BASE_URL, API_URL };
export default API_URL;
