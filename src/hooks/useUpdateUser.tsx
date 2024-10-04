import useSWR, { mutate } from "swr";

// Basic fetcher function that takes URL and options
const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

// Custom hook for updating a user
function useUpdateUser() {
  // Using SWR to fetch user data
  //@ts-ignore
  const { data, error, isLoading } = useSWR("/user", fetcher);

  // Function to update the user data
  const updateUser = async (userId: string, fieldsToUpdate: any) => {
    try {
      // Use mutate with the fetcher for PATCH request
      const updatedData = await mutate(
        `https://little-rabbit-67.convex.site/user?userId=${userId}`,
        fetcher(`https://little-rabbit-67.convex.site/user?userId=${userId}`, {
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
    updateUser,
    data,
    isLoading,
    isError: error,
  };
}

export default useUpdateUser;
