import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "../slices/counterSlice.js";
import activeModelReducer from "../slices/activemodelSlice.js";
import headerSlice from "../slices/headerSlice.js";
import chatHistorySlice from "../slices/chatHistorySlice.js";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        activeModel: activeModelReducer,
        headerSlice: headerSlice,
        chatHistory: chatHistorySlice,
    },
})