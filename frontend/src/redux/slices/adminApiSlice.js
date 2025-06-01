import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1/admin',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('adminToken');
    console.log('Token in prepareHeaders:', token); // Debug log
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log('API Response:', result); // Debug log

  if (result.error) {
    console.error('API Error:', result.error); // Debug log
    // Handle token expiration
    if (result.error.status === 401) {
      const errorMessage = result.error.data?.message || '';
      
      // Only redirect if token is expired or invalid
      if (errorMessage.includes('Token expired') || errorMessage.includes('Not authorized')) {
        if (!window.location.pathname.includes('/admin/login')) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminInfo');
          window.location.href = '/admin/login';
        }
      }
    }
  }

  return result;
};

export const adminApiSlice = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Admin'],
    }),
    getDashboardData: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/dashboard',
        method: 'GET',
        params: { page, limit }
      }),
      providesTags: ['Admin'],
      keepUnusedDataFor: 30,
    }),
    getContacts: builder.query({
      query: () => ({
        url: '/contacts',
        method: 'GET',
      }),
      providesTags: ['Admin'],
      keepUnusedDataFor: 30,
      transformResponse: (response) => {
        console.log('Contacts API Response:', response);
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch contacts');
        }
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Contacts API Error:', response);
        return {
          status: response.status,
          data: {
            message: response.data?.message || 'Failed to fetch contacts'
          }
        };
      }
    }),
    deleteContact: builder.mutation({
      query: (contactId) => ({
        url: `/contacts/${contactId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
    getTasks: builder.query({
      query: () => '/tasks',
      providesTags: ['Admin'],
      keepUnusedDataFor: 30,
    }),
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
    updateUserPoints: builder.mutation({
      query: ({ userId, points }) => ({
        url: `/users/${userId}/points`,
        method: 'PUT',
        body: { points },
      }),
      invalidatesTags: ['Admin'],
    }),
    getUserTasks: builder.query({
      query: (userId) => `/users/${userId}/tasks`,
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetDashboardDataQuery,
  useGetContactsQuery,
  useDeleteContactMutation,
  useGetTasksQuery,
  useDeleteTaskMutation,
  useUpdateUserPointsMutation,
  useGetUserTasksQuery,
} = adminApiSlice; 