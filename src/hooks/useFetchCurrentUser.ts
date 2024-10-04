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
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    });

  const { data, error, isLoading } = useSWR(
    token
      ? `https://little-rabbit-67.convex.site/currentUser?id=${userId}`
      : null,
    fetcher
  );

  return {
    currentUser: data,
    loading: isLoading,
    error,
  };
}

export default useFetchCurrentUser;
