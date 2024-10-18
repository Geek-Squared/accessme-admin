import useSWR from "swr";

function useFetchPersonnel() {
  const fetcher = (...args: any[]) =>
    fetch(...args)
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("personnelData", JSON.stringify(data));
        return data;
      });

  const initialData = localStorage.getItem("personnelData")
    ? JSON.parse(localStorage.getItem("personnelData")!)
    : null;

  const { data, error, isLoading } = useSWR(
    `https://different-armadillo-940.convex.site/user-personnel`,
    fetcher,
    { initialData }
  );

  return {
    personnel: data,
    isLoading,
    isError: error,
  };
}

export default useFetchPersonnel;
