// hooks/useEditSite.js
import useSWR, { mutate } from "swr";
import axios from "axios";
import { apiUrl } from "../utils/apiUrl";

const useEditSite = (siteId: any) => {
  const { data, error } = useSWR(
    siteId ? `${apiUrl}/site/${siteId}` : null,
    fetcher
  );

  // Fetcher function for SWR
  async function fetcher(url: any) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  // Update site function
  const updateSite = async (updatedData: any) => {
    try {
      // Perform the PUT request to update site data
      const response = await axios.put(
        `${apiUrl}/site/${siteId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Optimistically update SWR cache for the site
      mutate(`${apiUrl}/site/${siteId}`, { ...data, ...updatedData }, false);

      // Revalidate to refresh SWR cache with fresh data
      await mutate(`${apiUrl}/site/${siteId}`);

      return response.data;
    } catch (error) {
      console.error("Failed to update site:", error);
      throw error;
    }
  };

  return {
    site: data,
    isLoading: !error && !data,
    isError: error,
    updateSite,
  };
};

export default useEditSite;
