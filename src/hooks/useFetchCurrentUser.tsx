import useSWR from "swr";
import { apiUrl } from "../utils/apiUrl";

function useFetchCurrentUser() {
  const token = localStorage.getItem("token");

  // Define the fetcher function for SWR with authentication headers
  const fetcher = async (url: any) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return response.json();
  };

  // useSWR only fetches if `token` is available
  const { data, error, isLoading } = useSWR(
    token ? `${apiUrl}/user/me` : null,
    fetcher
  );

  console.log("data", data);

  return {
    user: data,
    loading: isLoading,
    error,
  };
}

export default useFetchCurrentUser;
