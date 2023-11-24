import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const preloaderSlice = createSlice({
  name: 'preloaderVisibility',
  initialState: {
    value: true,
  },
  reducers: {
    showPreloader: (state) => {
        state.value = true
    },
    disablePreloader: (state) => {
        state.value = false
    },
    setPreloaderVisibility: (state, action: PayloadAction<boolean>) => {
        state.value = action.payload
    }
  },
})

export const { showPreloader, disablePreloader, setPreloaderVisibility } = preloaderSlice.actions
export default preloaderSlice.reducer