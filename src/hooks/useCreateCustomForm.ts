import useSWR, { mutate } from "swr";
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

function useCreateCustomForm() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

  const createCategory = async (categoryData: any) => {
    const response = await mutate(
      `${apiUrl}/category/create`,
      fetcher(`${apiUrl}/category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(categoryData),
      }),
      false
    );

    console.log("Response from create category:", response);

    mutate(`${apiUrl}/category/create`);

    return response;
  };

  return {
    createCategory,
    data,
    isLoading,
    isError: error,
  };
}

export default useCreateCustomForm;
