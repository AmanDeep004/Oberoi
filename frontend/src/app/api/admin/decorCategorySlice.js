import apiSlice from "../apiSlice";

export const decorCategorySlice = apiSlice.injectEndpoints({
    tagTypes: ["DecorCategory"],
    endpoints: (builder) => ({
        getDecorCategory: builder.query({
            query: () => '/administrator/decorCateListAll',
            providedTags: ["DecorCategory"],
        }),
        getDecorCategoryWithCount: builder.query({
            query: ({ page, perPage }) => `/administrator/decorCateList/${page}/${perPage}`,
            providedTags: ["DecorCategory"],
        }),
        // getRoomById: builder.query({
        //     query: (hotelId, FoodIndex) => `/administrator/editRoom/${hotelId}/${FoodIndex}`,
        //     providesTags: ["RoomById"],
        // }),
        addDecorCategory: builder.mutation({
            query: (data) => ({
                url: "/administrator/decorCategoryData",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["DecorCategory"],
        }),
        updateDecorCategory: builder.mutation({
            query: (data) => ({
                url: `/administrator/decorCategoryUpd/${data?._id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["DecorCategory"],
        }),
        deleteDecorCategory: builder.mutation({
            query: (id) => ({
                url: `/administrator/decorCateDel/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DecorCategory"],
        }),
    })
});

export const {
    useGetDecorCategoryQuery,
    useGetDecorCategoryWithCountQuery,
    useAddDecorCategoryMutation,
    useUpdateDecorCategoryMutation,
    useDeleteDecorCategoryMutation,
} = apiSlice;