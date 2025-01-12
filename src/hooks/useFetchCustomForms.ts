// hooks/useFetchCustomForms.ts
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

function useFetchCustomForms() {
  const { data, error, isLoading, mutate: mutateForms } = useSWR(
    `${apiUrl}/category`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const refreshForms = () => {
    return mutateForms();
  };

  return {
    forms: data,
    isLoading,
    isError: error,
    refreshForms,
  };
}

export default useFetchCustomForms;
