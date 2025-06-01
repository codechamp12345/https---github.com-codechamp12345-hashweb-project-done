import { apiSlice } from "../apiSlice";

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query({
      query: () => ({
        url: "/tasks/list",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => {
        console.log('Tasks response:', response);
        return {
          tasks: response.tasks || [],
          ownTasks: response.ownTasks || [],
          points: response.points || 0
        };
      },
      providesTags: ["Tasks"],
    }),
    submitTask: builder.mutation({
      query: (data) => ({
        url: "/tasks/create",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Tasks"],
    }),
    completeTask: builder.mutation({
      query: (taskId) => ({
        url: `/tasks/${taskId}/complete`,
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(taskId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.userInfo) {
            // Immediately update points in Redux
            dispatch(apiSlice.util.updateQueryData('getUser', undefined, (draft) => {
              if (draft) {
                draft.points = data.userInfo.points;
              }
            }));
          }
        } catch (error) {
          console.error('Task completion error:', error);
        }
      },
      transformResponse: (response) => {
        if (!response.success) {
          throw { data: { message: response.message || 'Failed to complete task' } };
        }
        return response;
      },
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          data: {
            message: response.data?.message || 'Failed to complete task. Please try again.'
          }
        };
      },
      invalidatesTags: ["Tasks", "User"],
    }),
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `/tasks/admin/${taskId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useSubmitTaskMutation,
  useCompleteTaskMutation,
  useDeleteTaskMutation,
} = tasksApiSlice;
