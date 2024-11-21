import apiSlice from "../apiSlice";

export const dashboardSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllTop5: builder.query({
            query: ({ startDate, endDate }) => `/administrator/getTop5allData/${startDate}/${endDate}`,
        }),
        getTop5Food: builder.query({
            query: ({ startDate, endDate }) => `/administrator/getTop5FoodData/${startDate}/${endDate}`,
        }),
        getTop5Ent: builder.query({
            query: ({ startDate, endDate }) => `/administrator/getTop5EntData/${startDate}/${endDate}`,
        }),
        getTop5Decor: builder.query({
            query: ({ startDate, endDate }) => `/administrator/getTop5DecorData/${startDate}/${endDate}`,
        }),
        getTop5Venue: builder.query({
            query: ({ startDate, endDate }) => `/administrator/getTop5VenueData/${startDate}/${endDate}`,
        }),
        getLoginUsersList: builder.query({
            query: ({ startDate, endDate }) => `/administrator/loggedInUsers/${startDate}/${endDate}`,
        }),
        utmSourceCount: builder.query({
            query: ({ startDate, endDate }) => `/administrator/getUtsSourceCount/${startDate}/${endDate}`,
        }),

    })
});

export const {
    useGetAllTop5Query,
    useGetTop5FoodQuery,
    useGetTop5EntQuery,
    useGetTop5DecorQuery,
    useGetTop5VenueQuery,
    useGetLoginUsersListQuery, useUtmSourceCountQuery }
    = apiSlice;