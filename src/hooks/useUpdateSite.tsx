import useSWR, { mutate } from "swr";

// Basic fetcher function that takes URL and options
const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

// Custom hook for updating a user
function useUpdateSite() {
  // Using SWR to fetch user data
  //@ts-ignore
  const { data, error, isLoading } = useSWR("/site", fetcher);

  // Function to update the user data
  const updateSite = async (siteId: string, fieldsToUpdate: any) => {
    try {
      const updatedData = await mutate(
        `https://different-armadillo-940.convex.site/site?id=${siteId}`,
        fetcher(`https://different-armadillo-940.convex.site/site?id=${siteId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fieldsToUpdate),
        }),
        false
      );

      console.log("response from update", updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return {
    updateSite,
    data,
    isLoading,
    isError: error,
  };
}

export default useUpdateSite;
