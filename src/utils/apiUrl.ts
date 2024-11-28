export const apiUrl = 
  process.env.NODE_ENV === 'production'
    ? 'https://acsys-production.up.railway.app'
    : import.meta.env.VITE_API_URL;