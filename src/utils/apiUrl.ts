export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://acsys-app-813266374764.europe-west2.run.app"
    : import.meta.env.VITE_API_URL;
