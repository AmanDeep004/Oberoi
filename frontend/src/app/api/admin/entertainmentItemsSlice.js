import apiSlice from "../apiSlice";

export const entertainmentItemsSlice = apiSlice.injectEndpoints({
    tagTypes: ["Entertainment", "EntertainmentById"],
    endpoints: (builder) => ({

        getEntertainment: builder.query({
            query: () => '/administrator/entertainmentList',
            // providedTags: ["Entertainment"],
        }),
        getEntertainmentById: builder.query({
            query: (id) => `/administrator/entertainmentId/${id}`,
            providesTags: ["EntertainmentById"],
        }),

        getEntertainmentWithCount: builder.query({
            query: ({ page, perPage }) => `/administrator/entertainmentList/${page}/${perPage}`,
            providedTags: ["Entertainment"],
        }),
        getEntertainmentByHotelId: builder.query({
            query: (hotelId) => `/administrator/entertainmentList/${hotelId}`,
            providedTags: ["Entertainment"],
        }),
        addEntertainment: builder.mutation({
            query: (data) => ({
                url: "/administrator/entertainmentDataNew",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Entertainment"],
        }),


        updateEntertainment: builder.mutation({
            query: (data) => ({
                url: `/administrator/entertainmentupd/${data?._id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Entertainment"],
        }),
        deleteEntertainment: builder.mutation({
            query: (id) => ({
                url: `/administrator/entertainmentDel/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Entertainment"],
        }),
    })


});

export const {
    useGetEntertainmentQuery,
    useGetEntertainmentByHotelIdQuery,
    useGetEntertainmentByIdQuery,
    useGetEntertainmentWithCountQuery,
    useAddEntertainmentMutation,
    useUpdateEntertainmentMutation,
    useDeleteEntertainmentMutation,

} = apiSlice;