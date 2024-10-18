import useSWR, { mutate } from "swr";

function useFetchOrganization() {
  const userId = localStorage.getItem("id");

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch organization data");
    }
    const data = await response.json();
    localStorage.setItem("organizationData", JSON.stringify(data));
    return data;
  };

  const initialData = localStorage.getItem("organizationData")
    ? JSON.parse(localStorage.getItem("organizationData")!)
    : null;

  const { data, error, isValidating } = useSWR(
    userId ? "https://different-armadillo-940.convex.site/organization" : null,
    fetcher,
    //@ts-expect-error
    { initialData }
  );

  // Filter organization based on userId
  const filteredOrganization = data?.find(
    (org: any) => org.createdBy === userId
  );

  // Manual revalidation function
  const refreshOrganization = () => {
    mutate("https://different-armadillo-940.convex.site/organization");
  };

  return {
    organization: filteredOrganization,
    isLoading: !error && !data && isValidating,
    isError: !!error,
    refreshOrganization, // Expose the manual refresh function
  };
}

export default useFetchOrganization;
