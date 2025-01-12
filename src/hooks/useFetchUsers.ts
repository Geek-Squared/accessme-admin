import useSWR from "swr";
import { apiUrl } from "../utils/apiUrl";

function useFetchUsers() {
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
  const {
    data,
    error,
    isLoading,
    mutate: mutateForms,
  } = useSWR(`${apiUrl}/user`, fetcher);

  const refreshPersonnel = () => {
    return mutateForms();
  };

  return {
    users: data,
    userLoading: isLoading,
    userError: error,
    refreshPersonnel,
  };
}

export default useFetchUsers;
