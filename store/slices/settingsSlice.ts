import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  showStatesOverlay?: boolean;
}
const initialState: SettingsState = {
  theme: 'light',
  showStatesOverlay: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      console.log('Theme set to:', state.theme);
    },
    toggleStatesOverlay: (state) => {
      state.showStatesOverlay = !state.showStatesOverlay;
      console.log('Show states overlay:', state.showStatesOverlay);
    },
  },
});

export const { setTheme, toggleStatesOverlay } = settingsSlice.actions;
export default settingsSlice.reducer;
