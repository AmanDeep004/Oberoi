import apiSlice from "./apiSlice";

export const authSlice = apiSlice.injectEndpoints({
  tagTypes: [],
  endpoints: (builder) => ({
    generateOTP: builder.mutation({
      query: (data) => ({
        url: "/authOTP/generateOTP",
        method: "POST",
        body: data,
        // header: { hotelId, mobileNo: data.mobile, event: "Mobile Auth", deviceType, browserName, geoLocation }
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/authOTP/verifyOTP",
        method: "POST",
        body: data,
      }),
    }),
    getUserInfo: builder.mutation({
      query: () => ({
        url: "/authOTP/getUserData",
        method: "GET",
      }),
    }),
    getLoggedInUserInfo:builder.mutation({
      query: () => ({
        url: "/administrator/getUserData",
        method: "GET",
      }),
    })
  }),
});

export const {
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useGetUserInfoMutation,
  useGetLoggedInUserInfoMutation
} = authSlice;
