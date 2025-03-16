// slices/chatHistorySlice.js
import { createSlice } from '@reduxjs/toolkit';

export const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState: {
    chatHistory: [],
    brain: false,
    loading: false,
  },
  reducers: {
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
      console.log(state.chatHistory);
    },
    addMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBrain: (state, action) => {
      state.brain = action.payload;
    },
  },
});

export const { setChatHistory, addMessage, setLoading, setBrain } = chatHistorySlice.actions;
export default chatHistorySlice.reducer;
