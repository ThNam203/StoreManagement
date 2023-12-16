import { Position, Staff } from "@/entities/Staff";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const staffPositionSlice = createSlice({
  name: "staffPositions",
  initialState: {
    value: [] as Position[],
  },
  reducers: {
    setPositions: (state, action: PayloadAction<Position[]>) => {
            state.value = action.payload;
    },
    addPosition: (state, action: PayloadAction<Position>) => {
      state.value.push(action.payload);
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
      state.value = state.value.map((position) =>
      position.id === action.payload.id ? action.payload : position
      );
    },
    deletePosition: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((position) => position.id !== action.payload);
    },
  },
});

export const { 
    setPositions, 
    addPosition, 
    updatePosition, 
    deletePosition,
} =
staffPositionSlice.actions;
export default staffPositionSlice.reducer;
