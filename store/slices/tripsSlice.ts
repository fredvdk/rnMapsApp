import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '../../models/Trip';
import { fetchTrips } from '../../services/TripService';
import { AppDispatch } from '..';

interface TripsState {
  trips: Trip[];
  selectedTripId: string | null;
  showStatesOverlay?: boolean; // Optional: to manage state overlay visibility
}

const initialState: TripsState = {
  trips: [],
  selectedTripId: null,
  showStatesOverlay: false,
};

// ✅ thunk that calls your service and dispatches setTrips
export const fetchTripsFromApi = () => async (dispatch: AppDispatch) => {
  try {
    const trips = await fetchTrips(); // call your service
    dispatch(setTrips(trips)); // update redux state
  } catch (error) {
    console.error('Failed to fetch trips:', error);
  }
};

export const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips: (state, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
      //console.log('Trips set in state:', state.trips);
    },
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    },
    updateTrip: (state, action: PayloadAction<Trip>) => {
      const index = state.trips.findIndex(
        (trip) => trip.id === action.payload.id
      );
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
    },
    deleteTrip: (state, action) => {
      state.trips = state.trips.filter((trip) => trip.id !== action.payload);
    },
    
    setSelectedTrip: (state, action: PayloadAction<string>) => {
      state.selectedTripId = action.payload;
      console.log('Selected trip set to:', state.selectedTripId);
    },
    clearSelectedTrip: (state) => {
      state.selectedTripId = null;
    }
  }
});

export const {
  setTrips,
  addTrip,
  updateTrip,
  deleteTrip,
  setSelectedTrip,
  clearSelectedTrip
} = tripsSlice.actions;
export default tripsSlice.reducer;
