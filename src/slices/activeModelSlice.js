import {createSlice} from "@reduxjs/toolkit";

const activeModelSlice = createSlice({
    name: 'model',
    initialState: {
        currentModel: 'gpt-4o',
    },
    reducers: {
        setCurrentModel(state, action) {
            state.currentModel = action.payload;
        },
    },
});

export const { setCurrentModel } = activeModelSlice.actions;
export default activeModelSlice.reducer;