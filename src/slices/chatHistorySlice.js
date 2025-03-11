import { createSlice } from '@reduxjs/toolkit';

export const chatHistorySlice = createSlice({
    name: 'chatHistory',
    initialState: {
        chatHistory: [],
    },
    reducers: {
        setChatHistory: (state, action) => {
            state.chatHistory = action.payload;
        },
        addMessage: (state, action) => {
            state.chatHistory.push(action.payload);
        },
    },
});

export const { setChatHistory, addMessage } = chatHistorySlice.actions;
export default chatHistorySlice.reducer;
