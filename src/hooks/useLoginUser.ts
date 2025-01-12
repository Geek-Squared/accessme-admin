import useSWR, { mutate } from "swr";
import { apiUrl } from "../utils/apiUrl";

const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

function useLogin() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

  // Function to store token with expiration
  const storeTokenWithExpiration = (token: string, id: string, expirationHours = 24) => {
    const expirationTime = new Date().getTime() + (expirationHours * 60 * 60 * 1000);
    const tokenData = {
      token,
      id,
      expiry: expirationTime,
    };
    
    // Store in sessionStorage (clears when browser closes)
    sessionStorage.setItem('tokenData', JSON.stringify(tokenData));
    // Optional: Also store in localStorage for persistence
    localStorage.setItem('tokenData', JSON.stringify(tokenData));
  };

  // Function to check if token is expired
  const isTokenExpired = () => {
    const tokenData = sessionStorage.getItem('tokenData') || localStorage.getItem('tokenData');
    if (!tokenData) return true;

    const { expiry } = JSON.parse(tokenData);
    return new Date().getTime() > expiry;
  };

  // Function to clear tokens
  const clearTokens = () => {
    sessionStorage.removeItem('tokenData');
    localStorage.removeItem('tokenData');
  };

  const login = async (email: string, password: string) => {
    const response = await mutate(
      `${apiUrl}/auth/signin`,
      fetcher(`${apiUrl}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "ADMIN" }),
      }),
      false
    );
    
    // Store token with expiration
    storeTokenWithExpiration(response.token, response.id);
    return response;
  };

  // Function to get current token
  const getToken = () => {
    // First try sessionStorage, then localStorage
    const tokenData = sessionStorage.getItem('tokenData') || localStorage.getItem('tokenData');
    if (!tokenData) return null;

    const parsedData = JSON.parse(tokenData);
    if (isTokenExpired()) {
      clearTokens();
      return null;
    }

    return parsedData.token;
  };

  return {
    login,
    data,
    isLoading,
    isError: error,
    getToken,
    clearTokens,
    isTokenExpired,
  };
}

export default useLogin;