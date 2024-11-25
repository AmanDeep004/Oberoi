import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://sterlinghotels.vosmos.live/backend",
  baseUrl: "https://oberoiHotels.vosmos.live/backend",
  // baseUrl: "http://localhost:5025/",

  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("ad_token");

    if (token) {
      console.log("token found")
      headers.set("Token", `Bearer ${token}`);
    }

    return headers;



  },
});

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  endpoints: (builder) => ({}),
});

export default apiSlice;
