import apiSlice from "../apiSlice";

export const userRequirementSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserReq: builder.query({
            query: () => "/administrator/userRequirements",
        }),
        getUserRequestByHotelId: builder.query({
            query: (hotelId) => `/administrator/userRequirement/${hotelId}`,
            providedTags: ["UserRequirements"],
        }),
    }),
});

export const { useGetUserReqQuery, useGetUserRequestByHotelIdQuery } = apiSlice;
