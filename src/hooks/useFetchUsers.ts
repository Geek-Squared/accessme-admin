import useSWR from "swr";

function useFetchUsers() {
  //@ts-expect-error
  const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `https://different-armadillo-940.convex.site/user`,
    fetcher
  );
  return {
    user: data,
    userLoading: isLoading,
    userError: error,
  };
}

export default useFetchUsers;
