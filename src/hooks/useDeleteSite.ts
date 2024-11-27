import { mutate } from "swr";
import { apiUrl } from "../utils/apiUrl";

const fetcher = (url: string | URL | Request, options: RequestInit | undefined) =>
  fetch(url, options).then((res) => res.json());

function useDeleteSite() {
  const deleteSite = async (siteId: string) => {
    try {
      // Make a DELETE request to the API
      const response = await fetcher(`${apiUrl}/site/${siteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Response from delete site:", response);

      // Revalidate cache by mutating the relevant SWR key
      await mutate(`${apiUrl}/sites`);

      return response;
    } catch (error) {
      console.error("Failed to delete site:", error);
      throw error;
    }
  };

  return {
    deleteSite,
  };
}

export default useDeleteSite;
