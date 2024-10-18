import useSWR from "swr";

function useFetchCurrentUser() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  const fetcher = (url: string) =>
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("currentUser", JSON.stringify(data));
        return data;
      });

  const initialData = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;

  const { data, error, isLoading } = useSWR(
    token
      ? `https://different-armadillo-940.convex.site/currentUser?id=${userId}`
      : null,
    fetcher,
    //@ts-expect-error
    { initialData }
  );

  return {
    currentUser: data,
    loading: isLoading,
    error,
  };
}

export default useFetchCurrentUser;
