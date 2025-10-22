import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { CryptoService } from '@/utils/CryptoService';
import { useInterfaceStore } from '@/state/interface';

export interface ApiResponse<T> {
  payload: T | T[];
  message: string;
  metadata?: {
    totalCount: number;
    page: number;
    pages: number;
    prevPage: number | null;
    nextPage: number | null;
  };
  [key: string]: any;
}

function cleanParams(params: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });
  return cleaned;
}

const fetchData = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  options?: any
) => {
  const secret = process.env.ENCRYPTION_KEY!;
  const cryptoService = new CryptoService(secret);
  let response;

  switch (method) {
    case 'GET':
      const { keyword, pageNumber, pageLimit, filterOptions, sortOptions, includeOptions } =
        options || {};

      response = await axios.get(url, {
        params: {
          ...cleanParams({
            keyword,
            pageNumber,
            pageLimit,
            filterOptions,
            sortOptions,
            includeOptions,
          }),
        },
      });
      break;
    case 'POST':
      response = await axios.post(url, data);
      break;
    case 'PUT':
      response = await axios.put(url, data);
      break;
    case 'DELETE':
      response = await axios.delete(url, { data });
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }

  // Decrypt payload if it's encrypted
  if (method === 'GET' && typeof response.data.payload === 'string') {
    response.data.payload = JSON.parse(cryptoService.decrypt(response.data.payload));
  }

  return response.data;
};

/**
 * A flexible, store-independent React Query hook for API calls
 * Supports GET (queries), POST, PUT, DELETE (mutations) with built-in:
 * - Pagination, filtering, sorting, keyword search
 * - Automatic data decryption
 * - Error handling with toast notifications
 * - Query invalidation and redirects
 */
const useApiQuery = (options: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url?: string;
  key: string | string[];
  filter?: string;
  keyword?: string;
  sort?: string;
  limit?: number;
  include?: string;
  pageNumber?: number;
  queriesToInvalidate?: string[];
  successMessage?: string;
  redirectUrl?: string;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  const { addAlert } = useInterfaceStore((state) => state);
  const router = useRouter();

  const {
    method,
    url,
    key,
    filter,
    sort,
    pageNumber,
    include,
    limit,
    queriesToInvalidate,
    successMessage,
    redirectUrl,
    keyword,
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 1000 * 60 * 5, // 5 minutes
    cacheTime = 1000 * 60 * 10, // 10 minutes
    onSuccessCallback,
    onErrorCallback,
  } = options;

  const queryKey = typeof key === 'string' ? [key] : key;

  const query = useQuery({
    queryKey,
    queryFn: () =>
      fetchData(url!, 'GET', undefined, {
        keyword,
        pageNumber,
        pageLimit: limit,
        filterOptions: filter,
        sortOptions: sort,
        includeOptions: include,
      }),
    enabled: enabled && method === 'GET' && !!url,
    refetchOnWindowFocus,
    retry: 1,
    staleTime: staleTime,
    gcTime: cacheTime,
    meta: {
      errorMessage: `An error occurred while fetching data for ${
        Array.isArray(key) ? key.join(', ') : key
      }`,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { url?: string; formData?: any }) =>
      fetchData(url ? url : (data.url as any), method, data.formData),
    onSuccess: (data: any) => {
      if (successMessage) {
        addAlert({ message: successMessage, type: 'success', duration: 3000 });
      }

      queriesToInvalidate?.forEach((query: string) => {
        queryClient.invalidateQueries([query.split(',')] as any);
      });

      if (redirectUrl) {
        router.push(redirectUrl);
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      console.error(
        `Error in useApiQuery for ${Array.isArray(key) ? key.join(', ') : key}:`,
        error
      );
      const messageTxt =
        error.response && error.response.data.message ? error.response.data.message : error.message;

      addAlert({ message: messageTxt, type: 'error', duration: 10000 });
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  // Return based on method
  return method === 'GET' ? query : mutation;
};

export default useApiQuery;
