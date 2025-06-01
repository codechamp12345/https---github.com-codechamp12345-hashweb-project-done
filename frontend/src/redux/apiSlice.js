import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "./slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log('401 error, logging out');
    api.dispatch(clearCredentials());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Task"],
  endpoints: (builder) => ({}),
});
