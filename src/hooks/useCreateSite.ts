import useSWR, { mutate } from "swr";
import { apiUrl } from "../utils/apiUrl";

const fetcher = (url: string | URL | Request, options: RequestInit | undefined) =>
  fetch(url, options).then((res) => res.json());

function useCreateSite() {
  const { data, error, isLoading } = useSWR(null, fetcher, {
    shouldRetryOnError: false,
  });

  const createSite = async (siteData: any) => {
    const response = await mutate(
      `${apiUrl}/site/create`,
      fetcher(`${apiUrl}/site/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(siteData),
      }),
      false
    );

    console.log("Response from create site:", response);

    mutate(`${apiUrl}/site/create`);

    return response;
  };

  return {
    createSite,
    data,
    isLoading,
    isError: error,
  };
}

export default useCreateSite;
