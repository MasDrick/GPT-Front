// slices/chatHistorySlice.js
import { createSlice } from '@reduxjs/toolkit';

export const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState: {
    chatHistory: [],
    brain: false,
    lastUserMessage: '', // просто в памяти
  },
  reducers: {
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },
    addMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    setLastUserMessage: (state, action) => {
      state.lastUserMessage = action.payload;
    },
    setBrain: (state, action) => {
      state.brain = action.payload;
    },
  },
});

export const { setChatHistory, addMessage, setLastUserMessage, setBrain } =
  chatHistorySlice.actions;
export default chatHistorySlice.reducer;
