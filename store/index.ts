import { configureStore } from '@reduxjs/toolkit';
import tripsReducer from './slices/tripsSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    trips: tripsReducer, 
    settings: settingsReducer
  },
});

// Infer types for later use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
