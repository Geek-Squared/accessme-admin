import useSWR from "swr";

function useFetchPersonnel() {
  //@ts-expect-error
  const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `https://different-armadillo-940.convex.site/user-personnel`,
    fetcher
  );
  return {
    personnel: data,
    isLoading,
    isError: error,
  };
}

export default useFetchPersonnel;
