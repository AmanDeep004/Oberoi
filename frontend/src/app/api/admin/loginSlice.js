import apiSlice from "../apiSlice";

export const loginSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "administrator/login",
                method: "POST",
                body: data,
            })
        }),
        forgetPass: builder.mutation({
            query: (data) => ({
                url: "administrator/forgotPassword",
                method: "POST",
                body: data,
            })
        }),
        confirmPass: builder.mutation({
            query: (data) => ({
                url: "administrator/resetPassword",
                method: "POST",
                body: data,
            })
        })
    })
})

export const {
    useLoginMutation, useForgetPassMutation, useConfirmPassMutation
} = apiSlice