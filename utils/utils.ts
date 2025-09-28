export const formatDateToBEL = (dateInput: Date | string): string => {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0'); // DD
  const month = String(date.getMonth() + 1).padStart(2, '0'); // MM (0-based)
  const year = date.getFullYear(); // YYYY

  return `${day}/${month}/${year}`;
}

export function parseGeoJsonPolygons(geoJson: any) {
  return geoJson.features.map((feature: any) => {
    const name = feature.properties.NAME;
    const coords = feature.geometry.coordinates;
    const polygons = [];

    if (feature.geometry.type === 'Polygon') {
      polygons.push(
        coords[0].map(([lng, lat]: number[]) => ({
          latitude: lat,
          longitude: lng,
        }))
      );
    } else if (feature.geometry.type === 'MultiPolygon') {
      coords.forEach((polygon: any) => {
        polygons.push(
          polygon[0].map(([lng, lat]: number[]) => ({
            latitude: lat,
            longitude: lng,
          }))
        );
      });
    }

    return { name, polygons };
  });
}

export const Colors = {
  scheduledState: 'rgba(255, 0, 0, 0.4)', // Light blue for scheduled trips
  completedState: 'rgba(0, 255, 0, 0.2)', // Light green for completed trips
  strokeState: 'rgba(0, 0, 0, 1.0)', 
  scheduledDestination: 'blue',
  completedDestination: 'green',
  otherDestination: 'red',
  background: '#f0f0f0', // Light gray background
}
  
