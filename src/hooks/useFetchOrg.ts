import useSWR from "swr";

function useFetchOrganization() {
  const userId = localStorage.getItem("id");

  //@ts-expect-error
  const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://little-rabbit-67.convex.site/organization",
    fetcher
  );

  const filteredOrganization = data?.find(
    (org: any) => org.createdBy === userId
  );

  return {
    organization: filteredOrganization,
    isLoading,
    isError: error,
  };
}

export default useFetchOrganization;
