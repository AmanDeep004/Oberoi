import apiSlice from "./apiSlice";

export const hotelSlice1 = apiSlice.injectEndpoints({
    tagTypes: [
        "HotelById",
        "Hotel",
        "Food",
        "FoodById",
        "FoodPackage",
        "FoodPackageById",
        "Decor",
        "DecorById",
        "Room",
        "RoomById",
    ],
    endpoints: (builder) => ({
        // getHotel: builder.query({
        //     query: () => "/administrator/allHotels",
        //     providesTags: ["Hotel"],
        // }),
        // getHotelByCount: builder.query({
        //     query: ({ page, perPage }) => `/administrator/allHotels/${page}/${perPage}`,
        //     // providesTags: ["Hotel"],
        // }),

        // getHotelById: builder.query({
        //     query: (id) => `/admin/hotels/getHotelById/${id}`,
        //     providesTags: ["HotelById"],
        // }),
        // getHotelByHotelName: builder.query({
        //     query: (HotelId) => `administrator/getHotelByName/${HotelId}`,
        //     providesTags: ["HotelById"],
        // }),

        // addHotel: builder.mutation({
        //     query: (data) => ({
        //         url: "/administrator/addNewHotel",
        //         method: "POST",
        //         body: data,
        //     }),
        //     invalidatesTags: ["Hotel"],
        // }),
        // updateHotel: builder.mutation({
        //     query: (data) => ({
        //         url: "/administrator/updateHotelInfo",
        //         method: "POST",
        //         body: data,
        //     }),
        //     invalidatesTags: ["HotelById"],
        // }),
        // deleteHotel: builder.mutation({
        //     query: (id) => ({
        //         url: `/administrator/deleteHotel/${id}`,
        //         method: "DELETE",
        //     }),
        //     invalidatesTags: ["Hotel"],
        // }),
        getAllHalls: builder.query({
            query: (id) => ({
                url: `/administrator/allHalls/${id}`,
            }),
            providesTags: ["HotelById"],
        }),
        getAllFoodCategory: builder.query({
            query: () => ({
                url: `/food/category`,
            }),
        }),
        getAllHotelFoodPackages: builder.query({
            query: (id) => ({
                url: `/food/package/byHotelId/${id}`,
            }),
        }),
        getFoodItemByHotelId: builder.query({
            query: (id) => ({
                url: `/food/item/byHotelId/${id}`,
            }),
        }),
        getAllDecorCategory: builder.query({
            query: () => ({
                url: `/decor/category`,
            }),
        }),
        getDecorItemByHotelId: builder.query({
            query: (id) => ({
                url: `/decor/item/byHotelId/${id}`,
            }),
        }),
        getAllEntertainmentCategory: builder.query({
            query: () => ({
                url: `/entertainment/category`,
            }),
        }),
        getEntertainmentItemByHotelId: builder.query({
            query: (id) => ({
                url: `/entertainment/item/byHotelId/${id}`,
            }),
        }),
    }),
});

export const hotelSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        tagTypes: ["Hotel"],
        getHotel: builder.query({
            query: () => "/administrator/allHotels",
            providesTags: ["Hotel"],
        }),
        addHotel: builder.mutation({
            query: (data) => ({
                url: "/administrator/addNewHotel",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Hotel"],
        }),
        updateHotel: builder.mutation({
            query: (data) => ({
                url: "/administrator/updateHotelInfo",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Hotel"],
        }),
        deleteHotel: builder.mutation({
            query: (id) => ({
                url: `/administrator/deleteHotel/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Hotel"],
        }),
    }),
});

export const {
    useGetHotelQuery,
    useAddHotelMutation,
    useUpdateHotelMutation,
    useDeleteHotelMutation,
} = apiSlice;

export const {
    useGetHotelByCountQuery,
    useGetHotelByIdQuery,
    useGetHotelByHotelNameQuery,
    useGetAllHallsQuery,
    useGetAllFoodCategoryQuery,
    useGetAllHotelFoodPackagesQuery,
    useGetFoodItemByHotelIdQuery,
    useGetAllDecorCategoryQuery,
    useGetDecorItemByHotelIdQuery,
    useGetAllEntertainmentCategoryQuery,
    useGetEntertainmentItemByHotelIdQuery,
} = apiSlice;
