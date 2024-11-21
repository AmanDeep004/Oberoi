import apiSlice from "../apiSlice";

export const foodCategorySlice = apiSlice.injectEndpoints({
    tagTypes: ["Food", "FoodById"],
    endpoints: (builder) => ({

        getFoodCategory: builder.query({
            query: () => '/administrator/foodCateListAll',
            providedTags: ["Food"],
        }),
        getFoodCat: builder.mutation({
            query: () => '/administrator/foodCateListAll',
            providedTags: ["Food"],
        }),
        getFoodCategoryWithCount: builder.query({
            query: ({ page, perPage }) => `/administrator/foodCateList/${page}/${perPage}`,
            providedTags: ["Food"],
        }),
        addFoodCategory: builder.mutation({
            query: (data) => ({
                url: "/administrator/foodCategoryData",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Food"],
        }),
        updateFoodCategory: builder.mutation({
            query: (cateId) => ({
                url: `/administrator/foodCategoryUpd/${cateId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["FoodById"],
        }),
        deleteFoodCategory: builder.mutation({
            query: (cateId) => ({
                url: `/administrator/foodCateDel/${cateId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Food"],
        }),
    })

});

export const {
    useGetFoodCategoryQuery,
    useGetFoodCategoryWithCountQuery,
    useAddFoodCategoryMutation,
    useUpdateFoodCategoryMutation,
    useDeleteFoodCategoryMutation,
    useGetFoodCatMutation
} = apiSlice;