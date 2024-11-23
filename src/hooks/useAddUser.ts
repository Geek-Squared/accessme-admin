import useSWR, { mutate } from "swr";
import { apiUrl } from "../utils/apiUrl";

const fetcher = (
  url: string | URL | Request,
  options: RequestInit | undefined
) => fetch(url, options).then((res) => res.json());

function useCreateUser() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

  const createUser = async (userData: any) => {
    const response = await mutate(
      `${apiUrl}/user`,
      fetcher(`${apiUrl}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      }),
      false
    );

    console.log("Response from create user:", response);

    mutate(`${apiUrl}/user/create`);

    return response;
  };

  return {
    createUser,
    newUser: data,
    isLoading,
    isError: error,
  };
}

export default useCreateUser;
