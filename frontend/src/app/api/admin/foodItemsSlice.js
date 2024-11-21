import apiSlice from "../apiSlice";

export const foodItemsSlice = apiSlice.injectEndpoints({
    tagTypes: ["Food", "FoodById"],
    endpoints: (builder) => ({

        getFoodWithCount: builder.query({
            query: ({ page, perPage }) => `/administrator/foodList/${page}/${perPage}`,
            providedTags: ["Food"],
        }),
        getFoodByHotelId: builder.query({
            query: (hotelId) => `/administrator/foodList/${hotelId}`,
            providedTags: ["Food"],
        }),
        getFoodById: builder.query({
            query: (id) => `/administrator/foodById/${id}`,
            providesTags: ["Food"],
        }),
        addFood: builder.mutation({
            query: (data) => ({
                url: "/administrator/foodDataNew",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Food"],
        }),
        updateFood: builder.mutation({
            query: (data) => ({
                url: `/administrator/foodupd/${data?._id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Food"],
        }),
        deleteFood: builder.mutation({
            query: (id) => ({
                url: `/administrator/foodDel/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Food"],
        }),
    })

});

export const {
    useGetFoodWithCountQuery,
    useGetFoodByHotelIdQuery,
    useGetFoodByIdQuery,
    useAddFoodMutation,
    useUpdateFoodMutation,
    useDeleteFoodMutation,

} = apiSlice;