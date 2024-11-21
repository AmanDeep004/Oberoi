import apiSlice from "../apiSlice";

export const roomSlice = apiSlice.injectEndpoints({
    tagTypes: ["Room"],
    endpoints: (builder) => ({
        getRoom: builder.query({
            query: (hotelId) => `/administrator/allRooms/${hotelId}`,
            providedTags: ["Room"],
        }),
        // getRoomWithCount: builder.query({
        //     query: ({ hotelId, page, perPage }) => `/administrator/allRooms/${hotelId}/${page}/${perPage}`,
        //     // providedTags: ["Room"],
        // }),
        // getRoomById: builder.query({
        //     query: ({ hotelId, roomIndex }) => `/administrator/editRoom/${hotelId}/${roomIndex}`,
        //     // providesTags: ["RoomById"],
        // }),
        addRoom: builder.mutation({
            query: (data) => ({
                url: "/administrator/addNewRoom",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Room"],
        }),
        updateRoom: builder.mutation({
            query: (data) => ({
                url: "/administrator/updateHotelRoom",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Room"],
        }),
        deleteRoom: builder.mutation({
            query: ({ hotelId, roomId }) => ({
                url: `/administrator/deleteRoom/${hotelId}/${roomId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Room"],
        }),
    }),
});

export const {
    useGetRoomQuery,
    // useGetRoomWithCountQuery,
    // useGetRoomByIdQuery,
    useAddRoomMutation,
    useUpdateRoomMutation,
    useDeleteRoomMutation,
} = apiSlice;
