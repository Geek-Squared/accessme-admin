import useSWR from "swr";
import { apiUrl } from "../utils/apiUrl";

const fetcher = (...args: [RequestInfo, RequestInit?]) => {
  const token = localStorage.getItem("token");

  const options = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  return fetch(args[0], { ...options, ...args[1] }).then((res) => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  });
};


function useFetchSites() {
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/site`,
    fetcher,
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      dedupingInterval: 60000,  // Deduping interval of 1 minute
    }
  );
  return {
    sites: data,
    isLoading,
    isError: error,
  };
}

export default useFetchSites;