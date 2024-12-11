import { useQueries } from "@tanstack/react-query";
import axios from "@/utils/axios";
import { useSearchStore as store } from "./search/search";
import type { QueryKey } from "@tanstack/react-query";
import decryptData from "@/utils/decryptData";

const fetchData = async (options: any) => {
  const keyword = options?.defaultKeyword || store.getState().search;
  const pageNumber = options?.defaultPageNumber || store.getState().pageNumber;
  const pageLimit = options?.defaultPageLimit || store.getState().pageLimit;
  const filter = options?.defaultFilter || store.getState().filter;
  const sort = options?.defaultSort || store.getState().sort;

  const { data } = await axios.get(
    `${options?.url}?keyword=${keyword}&pageNumber=${pageNumber}&limit=${pageLimit}&filterOptions=${filter}&sortBy=${sort}`
  );

  if (typeof data.payload === "string") {
    data.payload = JSON.parse(decryptData(data.payload));
    return data;
  }

  return data;
};

const useParallelQueries = (options: any) => {
  const queryKeyBase = options?.key || "default";

  const queries = options?.queries?.map((query: any) => ({
    queryKey: [queryKeyBase, ...query.queryKey],
    queryFn: () =>
      fetchData({
        url: options?.url,
        defaultFilter: query.filter || options?.filter,
        defaultKeyword: options?.keyword,
        defaultPageLimit: options?.pageLimit,
        defaultPageNumber: options?.pageNumber,
        defaultSort: options?.sort,
      }),
    meta: {
      errorMessage: "An error occurred while fetching data",
    },
    enabled: options?.enabled,
    refetchOnWindowFocus: options?.refetchOnWindowFocus || false,
    retry: 1,
  }));

  const results = useQueries({ queries });

  return results;
};

export default useParallelQueries;
