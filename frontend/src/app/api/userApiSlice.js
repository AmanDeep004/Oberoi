import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://oberoiHotels.vosmos.Live/backend",
    // baseUrl: "http://localhost:5025/",

    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem("token");

        if (token) {
            console.log("token found")
            headers.set("Token", `Bearer ${token}`);
        }

        return headers;



    },
});

const userApiSlice = createApi({
    reducerPath: "userApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({}),
});

export default userApiSlice;
