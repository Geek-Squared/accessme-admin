import useSWR from "swr";

function fetchVisitors() {
  //@ts-expect-error
  const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `https://little-rabbit-67.convex.site/visitor`,
    fetcher
  );
  return {
    visitors: data,
    isLoading,
    isError: error,
  };
}

export default fetchVisitors;
