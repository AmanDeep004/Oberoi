import apiSlice from "../apiSlice";


export const foodPackageSlice = apiSlice.injectEndpoints({
    tagTypes: ["FoodPackage", "FoodPackageById"],
    endpoints: (builder) => ({

        getFoodPackageWithCount: builder.query({
            query: ({ hotelId, page, perPage }) => `/administrator/foodpackageHotelId/${hotelId}/${page}/${perPage}`,
            providesTags: ["FoodPackage"],
        }),
        getFoodPackageByHotelId: builder.query({
            query: (hotelId) => `/administrator/foodpackageByHotelId/${hotelId}`,
            providesTags: ["FoodPackageById"],
        }),
        getFoodPackageById: builder.query({
            query: (id) => `/administrator/foodPackageById/${id}`,
            providesTags: ["FoodPackageById"],
        }),
        addFoodPackage: builder.mutation({
            query: (data) => ({
                url: "/administrator/saveFoodPackage",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["FoodPackage"],
        }),
        updateFoodPackage: builder.mutation({
            query: (data) => ({
                url: '/administrator/updateFoodPackage',
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["FoodPackageById"],
        }),
        deleteFoodPackage: builder.mutation({
            query: (id) => ({
                url: `/administrator/deleteFoodPackage/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FoodPackage"],
        }),
    })

});

export const {

    useGetFoodPackageWithCountQuery,
    useGetFoodPackageByHotelIdQuery,
    useGetFoodPackageByIdQuery,
    useAddFoodPackageMutation,
    useUpdateFoodPackageMutation,
    useDeleteFoodPackageMutation,

} = apiSlice;