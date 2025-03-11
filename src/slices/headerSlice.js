import {createSlice} from "@reduxjs/toolkit";

export const headerSlice = createSlice({
  name: 'header',
  initialState: {
    open: true,
    clearChat: false
  },

  reducers: {
    setOpenDrawer: (state, action) => {
      state.open = action.payload;
    },
    setClearChat: (state, action) => {
      state.clearChat = action.payload;
    }
  }
})

export const {setOpenDrawer, setClearChat} = headerSlice.actions;

export default headerSlice.reducer;