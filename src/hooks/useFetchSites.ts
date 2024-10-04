import useSWR from "swr";

function useFetchSites() {
  //@ts-expect-error
  const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `https://little-rabbit-67.convex.site/site`,
    fetcher
  );
  return {
    sites: data,
    isLoading,
    isError: error,
  };
}

export default useFetchSites;
