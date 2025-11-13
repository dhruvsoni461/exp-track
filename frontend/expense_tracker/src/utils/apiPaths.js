// ✅ Vite uses import.meta.env instead of process.env
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const SIGNUP = `${BASE_URL}/api/auth/signup`;
export const LOGIN = `${BASE_URL}/api/auth/login`;

export { BASE_URL };
