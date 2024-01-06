import { DailyShift, Shift } from "@/entities/Attendance";
import {
  convertDailyShiftReceived,
  convertShiftReceived,
} from "@/utils/shiftApiUtils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const shiftSlice = createSlice({
  name: "shifts",
  initialState: {
    value: [] as Shift[],
  },
  reducers: {
    setShifts: (state, action: PayloadAction<any[]>) => {
      const shifts = action.payload.map((shift) => convertShiftReceived(shift));
      state.value = shifts;
    },
    addShift: (state, action: PayloadAction<any>) => {
      const shift = convertShiftReceived(action.payload);
      state.value.push(shift);
    },
    addShifts: (state, action: PayloadAction<any[]>) => {
      const shifts = action.payload.map((shift) => convertShiftReceived(shift));
      shifts.forEach((shift) => state.value.push(shift));
    },
    updateShift: (state, action: PayloadAction<any>) => {
      const updatedShift = convertShiftReceived(action.payload);
      state.value = state.value.map((shift) =>
        shift.id === updatedShift.id ? updatedShift : shift,
      );
    },
    deleteShift: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((shift) => shift.id !== action.payload);
    },
    addDailyShift: (state, action: PayloadAction<any>) => {
      const dailyShift = convertDailyShiftReceived(action.payload);
      state.value = state.value.map((shift) =>
        shift.id === dailyShift.shiftId
          ? {
              ...shift,
              dailyShiftList: [...shift.dailyShiftList, dailyShift],
            }
          : shift,
      );
    },
    addDailyShifts: (state, action: PayloadAction<any[]>) => {
      const dailyShifts = action.payload.map((dailyShift) =>
        convertDailyShiftReceived(dailyShift),
      );
      dailyShifts.forEach((dailyShift) => {
        state.value = state.value.map((shift) =>
          shift.id === dailyShift.shiftId
            ? {
                ...shift,
                dailyShiftList: [...shift.dailyShiftList, dailyShift],
              }
            : shift,
        );
      });
    },
    updateDailyShift: (state, action: PayloadAction<any>) => {
      const updatedDailyShift = convertDailyShiftReceived(action.payload);
      state.value = state.value.map((shift) =>
        shift.id === updatedDailyShift.shiftId
          ? {
              ...shift,
              dailyShiftList: shift.dailyShiftList.map((dailyShift) =>
                dailyShift.date.toLocaleDateString() ===
                updatedDailyShift.date.toLocaleDateString()
                  ? updatedDailyShift
                  : dailyShift,
              ),
            }
          : shift,
      );
    },
    updateDailyShifts: (state, action: PayloadAction<any[]>) => {
      //get all dailyShifts existed in action.payload but not in state
      //explain: update dailyShifts means override all dailyShifts in state with dailyShifts in action.payload
      const updatedDailyShifts = action.payload.map((dailyShift) =>
        convertDailyShiftReceived(dailyShift),
      );
      const dailyShiftToAdd = updatedDailyShifts.filter(
        (dailyShift) =>
          !state.value
            .find((shift) => shift.id === dailyShift.shiftId)
            ?.dailyShiftList.find(
              (_dailyShift) =>
                _dailyShift.date.toLocaleDateString() ===
                dailyShift.date.toLocaleDateString(),
            ),
      );

      dailyShiftToAdd.forEach((dailyShift) => {
        state.value = state.value.map((shift) =>
          shift.id === dailyShift.shiftId
            ? {
                ...shift,
                dailyShiftList: [...shift.dailyShiftList, dailyShift],
              }
            : shift,
        );
      });

      updatedDailyShifts.forEach((dailyShift) => {
        state.value = state.value.map((shift) =>
          shift.id === dailyShift.shiftId
            ? {
                ...shift,
                dailyShiftList: shift.dailyShiftList.map((_dailyShift) =>
                  dailyShift.date.toLocaleDateString() ===
                  _dailyShift.date.toLocaleDateString()
                    ? dailyShift
                    : _dailyShift,
                ),
              }
            : shift,
        );
      });
    },
    deleteDailyShift: (state, action: PayloadAction<DailyShift>) => {
      state.value = state.value.map((shift) =>
        shift.id === action.payload.shiftId
          ? {
              ...shift,
              dailyShiftList: shift.dailyShiftList.filter(
                (dailyShift) =>
                  dailyShift.date.toLocaleDateString() !==
                  action.payload.date.toLocaleDateString(),
              ),
            }
          : shift,
      );
    },
    deleteDailyShifts: (state, action: PayloadAction<DailyShift[]>) => {
      action.payload.forEach((dailyShift) => {
        state.value = state.value.map((shift) =>
          shift.id === dailyShift.shiftId
            ? {
                ...shift,
                dailyShiftList: shift.dailyShiftList.filter(
                  (_dailyShift) =>
                    dailyShift.date.toLocaleDateString() !==
                    _dailyShift.date.toLocaleDateString(),
                ),
              }
            : shift,
        );
      });
    },
  },
});

export const {
  setShifts,
  addShift,
  addShifts,
  updateShift,
  deleteShift,
  addDailyShift,
  addDailyShifts,
  updateDailyShift,
  updateDailyShifts,
  deleteDailyShift,
  deleteDailyShifts,
} = shiftSlice.actions;
export default shiftSlice.reducer;
