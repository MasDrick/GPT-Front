import {createSlice} from "@reduxjs/toolkit";

const modelSlice = createSlice({
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

export const { setCurrentModel } = modelSlice.actions;
export default modelSlice.reducer;