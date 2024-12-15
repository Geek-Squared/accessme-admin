import useSWR, { mutate } from "swr";
import { apiUrl } from "../utils/apiUrl";

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
      `https://acsys-app-813266374764.europe-west2.run.app/auth/signup`,
      fetcher(
        `https://acsys-app-813266374764.europe-west2.run.app/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, password, role }),
        }
      ),
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
