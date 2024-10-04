import useSWR, { mutate } from "swr";

const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

function useLogin() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

  const login = async (email: string, password: string) => {
    const response = await mutate(
      "https://little-rabbit-67.convex.site/auth/admin",
      fetcher("https://little-rabbit-67.convex.site/auth/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
