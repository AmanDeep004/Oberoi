import apiSlice from "../apiSlice";
export const uploadImageSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (data) => ({
                url: "/uploadImage",
                method: "POST",
                body: data,
            }),
        }),
    })
})

export const { useUploadImageMutation } = apiSlice;