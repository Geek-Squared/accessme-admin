import useSWR, { mutate } from "swr";

const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

function useSignUp() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ) => {
    const response = await mutate(
      "http://localhost:8080/auth/signup",
      fetcher("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
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
