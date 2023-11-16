import { createSlice } from '@reduxjs/toolkit'

export const preloaderSlice = createSlice({
  name: 'preloaderVisibility',
  initialState: {
    value: false,
  },
  reducers: {
    showPreloader: (state) => {
        state.value = true
    },
    disablePreloader: (state) => {
        state.value = false
    },
    setPreloaderVisibility: (state, action) => {
        state.value = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { showPreloader, disablePreloader, setPreloaderVisibility } = preloaderSlice.actions
export default preloaderSlice.reducer