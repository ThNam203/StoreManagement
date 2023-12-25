import { DetailPunishAndBonusList } from "@/entities/Attendance";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const staffPunishAndBonusSlice = createSlice({
  name: "staffPunishAndBonus",
  initialState: {
    value: [] as DetailPunishAndBonusList[],
  },
  reducers: {
    setDetailPunishAndBonusList: (
      state,
      action: PayloadAction<DetailPunishAndBonusList[]>,
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDetailPunishAndBonusList } = staffPunishAndBonusSlice.actions;
export default staffPunishAndBonusSlice.reducer;
