import { Trip } from "@/models/Trip";

const url = 'https://trips-map-fawn.vercel.app/api';

export const fetchTrips = async () => {
  try {
    const res = await fetch(`${url}/trips`, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    const json = await res.json();
    console.log('Fetched trips from API');
    return json;
  } catch (err) {
    console.error('Error fetching trips:', err);
    return null; // or throw err depending on your app
  }
};


export const updateTrip = async (trip: Trip) => {
  const response = await fetch(`${url}/trips/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id: trip.id, trip: trip}),
  });
  if (!response.ok) {
    //throw new Error("Failed to update trip");
    return 'Failed to update trip';
  }
  else {
    await fetchTrips(); // Refresh trips after update
  }
  return await response.json();
} 

export const createTrip = async (trip: Trip) => {
  const response = await fetch(`${url}/trips/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({trip}),
  });
  if (!response.ok) {
    //throw new Error("Failed to create trip");
    console.error('Failed to create trip:', response.statusText);
    return 'Failed to create trip';
  }
  else {
    await fetchTrips(); // Refresh trips after creation
  }
  return await response.json();
};

export const deleteTrip = async (tripId: string) => {
  console.log('Deleting trip with ID:', tripId);
  if (!tripId) {
    console.error('Invalid trip ID:', tripId);
    return 'Invalid trip ID';
  }
  const response = await fetch(`${url}/trips/${tripId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    //throw new Error("Failed to delete trip");
    return 'Failed to delete trip';
  }
  else {
    await fetchTrips(); // Refresh trips after deletion
  }
  return await response.json();
};
