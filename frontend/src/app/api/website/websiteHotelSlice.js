import userApiSlice from "../userApiSlice";

export const websiteSlice = userApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllHotel: builder.query({
            query: () => "/user/allHotels",
        }),
        getHotelInfoById: builder.query({
            query: (id) => `/user/getHotelById/${id}`
        }),
        saveUserRequirement: builder.mutation({
            query: (data) => ({
                url: `/user/saveUserRequirements/${data?.hotelId}`,
                method: "POST",
                body: data,
            }),
        }),
        createMeetingRequest: builder.mutation({
            query: (data) => ({
                url: `/user/createMeetingRequest/${data?.hotelId}`,
                method: "POST",
                body: data,
            }),
        })


    })
})

export const {
    useGetAllHotelQuery,
    useGetHotelInfoByIdQuery,
    useSaveUserRequirementMutation,
    useCreateMeetingRequestMutation,
} = userApiSlice