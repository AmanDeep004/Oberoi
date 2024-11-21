import apiSlice from "../apiSlice";


export const userSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        tagTypes: ["User"],
        getUser: builder.query({
            query: () => '/administrator/users',
            providesTags: ["User"]
        }),
        addUser: builder.mutation({
            query: (data) => ({
                url: "/administrator/users",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: "/administrator/users",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (data) => ({
                url: `/administrator/users/${data}`,
                method: "DELETE", 
            }),
            invalidatesTags: ["User"],
        })

    })

});

export const {
    useGetUserQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = apiSlice;