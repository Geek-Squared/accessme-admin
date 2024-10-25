import useSWR from "swr";

//@ts-expect-error
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

function useFetchSites() {
  const { data, error, isLoading } = useSWR(
    `https://different-armadillo-940.convex.site/site`,
    fetcher,
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      dedupingInterval: 60000,  // Deduping interval of 1 minute
    }
  );
  return {
    sites: data,
    isLoading,
    isError: error,
  };
}

export default useFetchSites;