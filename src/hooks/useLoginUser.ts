import useSWR, { mutate } from "swr";
import { apiUrl } from "../utils/apiUrl";

const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

function useLogin() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

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
    console.log("response from login", response);
    localStorage.setItem("token", response.token);
    localStorage.setItem("id", response.id);
    return response;
  };

  return {
    login,
    data,
    isLoading,
    isError: error,
  };
}

export default useLogin;
