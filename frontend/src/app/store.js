import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./api/apiSlice";
import userApiSlice from "./api/userApiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [userApiSlice.reducerPath]: userApiSlice.reducer,


    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
            .concat(userApiSlice.middleware),
    devTools: true,
});

setupListeners(store.dispatch);

