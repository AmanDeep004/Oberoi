import apiSlice from "../apiSlice";

export const entertainmentCatSlice = apiSlice.injectEndpoints({
    tagTypes: ["EntertainmentCat", "EntertainmentCatById"],
    endpoints: (builder) => ({

        getEntertainmentCat: builder.query({
            query: () => '/administrator/entertainmentCateListAll',
            providedTags: ["EntertainmentCat"],
        }),
        getEntertainmentCatWithCount: builder.query({
            query: ({ page, perPage }) => `/administrator/entertainmentCateList/${page}/${perPage}`,
            providedTags: ["EntertainmentCat"],
        }),

        addEntertainmentCat: builder.mutation({
            query: (data) => ({
                url: "/administrator/entertainmentCategoryData",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["EntertainmentCat"],
        }),
        updateEntertainmentCat: builder.mutation({
            query: (cateId) => ({
                url: `/administrator/entertainmentCategoryUpd/${cateId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["EntertainmentCatById"],
        }),
        deleteEntertainmentCat: builder.mutation({
            query: (cateId) => ({
                url: `/administrator/entertainmentCateDel/${cateId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["EntertainmentCat"],
        }),
    })

});

export const {
    useGetEntertainmentCatQuery,
    useGetEntertainmentCatWithCountQuery,
    useAddEntertainmentCatMutation,
    useUpdateEntertainmentCatMutation,
    useDeleteEntertainmentCatMutation,

} = apiSlice;