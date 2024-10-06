import useSWR, { mutate } from "swr";

// Basic fetcher function that takes URL and options
const fetcher = (url: string, options: any) =>
  fetch(url, options).then((res) => res.json());

// Custom hook for updating a user
function useUpdateOrganization() {
  // Fetch organization data using SWR (optional)
  //@ts-expect-error
  const { data, error, isLoading } = useSWR("/organization", fetcher);

  // Function to update the organization dynamically with personnel
  const updateOrganization = async (orgId: string, fieldsToUpdate: any) => {
    try {
      // Fetch the existing organization data
      const currentOrg = await fetch(
        `https://different-armadillo-940.convex.site/organization?id=${orgId}`
      ).then((res) => res.json());

      // Merge the new personnel with the existing personnel
      const updatedPersonnel = [
        ...(currentOrg?.personnel || []), // Existing personnel array (if any)
        ...(fieldsToUpdate.personnel || []), // New personnel being added
      ];

      // Create the updated fields object with the merged personnel array
      const updatedFields = {
        ...fieldsToUpdate,
        personnel: updatedPersonnel, // Set the merged personnel array
      };

      // Send the PATCH request to update the organization
      const updatedData = await mutate(
        `https://different-armadillo-940.convex.site/organization?id=${orgId}`,
        fetcher(
          `https://different-armadillo-940.convex.site/organization?id=${orgId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFields), // Send merged personnel
          }
        ),
        false
      );

      console.log("response from update", updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }
  };

  return {
    updateOrganization,
    data,
    isLoading,
    isError: error,
  };
}

export default useUpdateOrganization;
