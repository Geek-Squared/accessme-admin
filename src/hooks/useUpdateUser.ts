import useSWR, { mutate } from "swr";
import { apiUrl } from "../utils/apiUrl";

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
        `${apiUrl}/user/${userId}`,
        fetcher(`${apiUrl}/user/${userId}`, {
          method: "PUT",
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
