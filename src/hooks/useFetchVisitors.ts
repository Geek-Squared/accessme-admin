import useSWR from "swr";
import { apiUrl } from "../utils/apiUrl";

function fetchVisitors() {
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

  const { data, error, isLoading } = useSWR(`${apiUrl}/visitor`, fetcher);

  return {
    visitors: data,
    isLoading,
    isError: error,
  };
}

export default fetchVisitors;
