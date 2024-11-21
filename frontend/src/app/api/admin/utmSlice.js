import apiSlice from "../apiSlice";

export const utmSlice = apiSlice.injectEndpoints({
    tagTypes: ["Utm"],
    endpoints: (builder) => ({

        // Get all UTM records
        getAllUtms: builder.query({
            query: () => '/administrator/getAllUtms',
            providesTags: ["Utm"],
        }),

        // Save new UTM
        createUtm: builder.mutation({
            query: (newUtm) => ({
                url: '/administrator/saveUtm',
                method: 'POST',
                body: newUtm,
            }),
            invalidatesTags: ["Utm"],
        }),

        // Edit existing UTM by ID
        updateUtm: builder.mutation({
            query: ({ utmId, updatedUtm }) => ({
                url: `/administrator/editUtm/${utmId}`,
                method: 'PUT',
                body: updatedUtm,
            }),
            invalidatesTags: ["Utm"],
        }),

        // Delete UTM by ID
        deleteUtm: builder.mutation({
            query: (utmId) => ({
                url: `/administrator/deleteUtm/${utmId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Utm"],
        }),

    }),
});

export const {
    useGetAllUtmsQuery,
    useCreateUtmMutation,
    useUpdateUtmMutation,
    useDeleteUtmMutation,
} = utmSlice;
