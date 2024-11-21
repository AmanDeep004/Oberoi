import userApiSlice from "../userApiSlice";

export const interactionSlice = userApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        saveInteraction: builder.mutation({
            query: (data) => ({
                url: `/user/saveInteraction`,
                method: "POST",
                body: data,
            })
        })
    })
})

export const {
    useSaveInteractionMutation
} = userApiSlice