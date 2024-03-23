import useAsync from "./useAsync";

const DEFAULT_OPTIONS = {
  headers: { "Content-type": "application/json" },
};
const useFetch = (url: any, options = {}, dependencies: any[] = []) => {
  return useAsync(() => {
    return fetch(url, { ...DEFAULT_OPTIONS, ...options }).then((res) => {
      if (res.ok) return res.json();

      // WE MADE THIS LINE BECAUSE BY DEFAULT FETCH NEVER REALLY FAILS EVEN IF YOU HAVE A FAILED REQUEST, SO WE MAKE SURE THAT WE ACTUALLY FAILED THIS IF REQUEST WAS A FAILURE
      return res.json().then((json) => Promise.reject(json));
    });
  }, dependencies);
};

export default useFetch;
