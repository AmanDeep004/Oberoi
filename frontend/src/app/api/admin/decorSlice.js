import apiSlice from "../apiSlice";

export const decorSlice = apiSlice.injectEndpoints({
    tagTypes: ["Decor", "DecorById"],
    endpoints: (builder) => ({

        getDecorWithCount: builder.query({
            query: ({ page, perPage }) => `/administrator/decorList/${page}/${perPage}`,
            providedTags: ["Decor"],
        }),
        getDecorByHotelId: builder.query({
            query: (hotelId) => `/administrator/getDecorByHotelId/${hotelId}`,
            providedTags: ["Decor"],
        }),
        getDecorById: builder.query({
            query: (id) => `/administrator/decorById/${id}`,
            providesTags: ["DecorById"],
        }),
        addDecor: builder.mutation({
            query: (data) => ({
                url: "/administrator/decorDataNew",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Decor"],
        }),
        updateDecor: builder.mutation({
            query: (data) => ({
                url: `/administrator/decorupd/${data._id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Decor"],
        }),
        deleteDecor: builder.mutation({
            query: (id) => ({
                url: `/administrator/decorDel/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Decor"],
        }),
    })

});

export const {
    useGetDecorWithCountQuery,
    useGetDecorByHotelIdQuery,
    useGetDecorByIdQuery,
    useAddDecorMutation,
    useUpdateDecorMutation,
    useDeleteDecorMutation,
} = apiSlice;