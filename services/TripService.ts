import { Trip } from "@/models/Trip";

const url = "http://whitechapel.ddns.net:3000/api";

export const fetchTrips = async () => {
  const data = await fetch(`${url}/trips`, {
    method: "GET"});
  const json = await data.json();
  console.log('Fetched trips from API');
  const converted = json.map((trip: Trip) => ({// Convert latitude and longitude to numbers
    ...trip,
    latitude: parseFloat(trip.latitude),
    longitude: parseFloat(trip.longitude),
  }));
  return converted;
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
