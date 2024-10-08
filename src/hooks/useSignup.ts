import useSWR, { mutate } from "swr";

const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

function useSignUp() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

  const signup = async (
    username: string,
    email: string,
    password: string,
    role: string
  ) => {
    const response = await mutate(
      "https://different-armadillo-940.convex.site/user",
      fetcher("https://different-armadillo-940.convex.site/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      }),
      false
    );
    console.log(response);
    localStorage.setItem("token", response.token);
    return response;
  };

  return {
    signup,
    data,
    isLoading,
    isError: error,
  };
}

export default useSignUp;
