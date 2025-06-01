import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      transformResponse: (response) => {
        if (response.success) {
          return { data: response };
        }
        throw new Error(response.message || 'Registration failed');
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      transformResponse: (response) => {
        console.log('Transforming login response:', response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.log('Login error response:', error);
        return error;
      },
    }),
    // verifyEmail: builder.mutation({
    //   query: (data) => ({
    //     url: "/verify-email",
    //     method: "POST",
    //     body: data,
    //     credentials: "include",
    //   }),
    // }),
    // resendCode: builder.mutation({
    //   query: (data) => ({
    //     url: "/resend-code",
    //     method: "POST",
    //     body: data,
    //     credentials: "include",
    //   }),
    // }),
    // forgotPassword: builder.mutation({
    //   query: (data) => ({
    //     url: "/password/forgot",
    //     method: "POST",
    //     body: data,
    //     credentials: "include",
    //   }),
    // }),
    // resetPassword: builder.mutation({
    //   query: ({ token, password, confirmPassword }) => ({
    //     url: `/reset-password/${token}`,
    //     method: "PUT",
    //     body: { password, confirmPassword },
    //   }),
    // }),
    // updateProfile: builder.mutation({
    //   query: (data) => ({
    //     url: `/me/update`,
    //     method: "PUT",
    //     body: data,
    //     credentials: "include",
    //   }),
    // }),
    // updatePassword: builder.mutation({
    //   query: (data) => ({
    //     url: `/password/update`,
    //     method: "PUT",
    //     body: data,
    //     credentials: "include",
    //   }),
    // }),
    // getAllUsers: builder.query({
    //   query: () => ({
    //     url: `/admin/users`,
    //     method: "GET",
    //     credentials: "include",
    //   }),
    //   providesTags: ["User"], //when user will be deleted the list will automatically updates
    // }),
    // getUserById: builder.query({
    //   query: ({ id }) => ({
    //     url: `/admin/user/${id}`,
    //     method: "GET",
    //     credentials: "include",
    //   }),
    // }),
    // updateUserRole: builder.mutation({
    //   query: ({ id, role }) => ({
    //     url: `admin/user/${id}`,
    //     method: "PUT",
    //     body: { role },
    //     credentials: "include",
    //   }),
    //   invalidatesTags: ["User"],
    // }),
    // deleteUser: builder.mutation({
    //   query: (id) => ({
    //     url: `/admin/user/${id}`,
    //     method: "DELETE",
    //     credentials: "include",
    //   }),
    //   invalidatesTags: ["User"], //when user will be deleted the list will automatically updates
    // }),
    // logout: builder.mutation({
    //   query: () => ({
    //     url: "/logout",
    //     method: "GET",
    //     credentials: "include",
    //   }),
    // }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  //   useVerifyEmailMutation,
  //   useResetPasswordMutation,
  //   useResendCodeMutation,
  //   useForgotPasswordMutation,
  //   useUpdateProfileMutation,
  //   useUpdatePasswordMutation,
  //   useGetAllUsersQuery,
  //   useGetUserByIdQuery,
  //   useUpdateUserRoleMutation,
  //   useDeleteUserMutation,
  //   useLogoutMutation,
} = userApiSlice;
