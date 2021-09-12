import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "../Features/loginSlice";

export const store = configureStore({
    reducer: {
        login: loginReducer
    }
})