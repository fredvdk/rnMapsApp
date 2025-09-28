import { BackHandler, StyleSheet, Switch, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { ReactNode, useState } from 'react';
import { Trip } from '@/models/Trip';
import { Colors, parseGeoJsonPolygons } from '@/utils/utils';
import usStates from '@/utils/states.json'; // Assuming you have a JSON file with US states and their colors
import * as Location from "expo-location";
import MenuBar from '@/components/menuBar';
import MenuIcon from '@/components/menuIcon';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTrip } from '@/store/slices/tripsSlice';
import { router } from 'expo-router';

type State = {
  name: string;
  color: string;
  polygons: Position[][];
};

type Position = {
  latitude: number;
  longitude: number;
};

export default function TripsScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const allUSStates = usStates.features.map((state: any) => ({
    name: state.properties.NAME
  })); // Extract state names from the GeoJSON

  const trips: Trip[] = useSelector((state: RootState) => state.trips.trips);
  const selectedTripId = useSelector((state: RootState) => state.trips.selectedTripId);
  const selectedTrip = trips.find(trip => trip.id === selectedTripId) || null;
  const showStatesOverlay = useSelector((state: RootState) => state.settings.showStatesOverlay);

  const visitedStates = new Set<string>(trips
    .filter(trip => trip.status === 'Completed')
    .map(trip => trip.state) // Collect unique states from trips
    .filter(state => state !== undefined && state !== null)); // Filter out undefined or null 

  const states: State[] = parseGeoJsonPolygons(usStates);

  const mapRef = useRef<MapView>(null);

  const defaultCenterUSA = {
    latitude: 36,
    longitude: -78,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };

  useEffect(() => {
    if (selectedTrip) {
      mapRef.current?.animateToRegion(
        {
          latitude: parseFloat(selectedTrip.latitude),
          longitude: parseFloat(selectedTrip.longitude),
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        },
        1000
      );
    } else {
      mapRef.current?.animateToRegion(defaultCenterUSA, 1000);
    }
  }, [selectedTrip]);

  // 2. Ask for location permission & fetch current location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

      } catch (err) {
        console.error(err);
        setErrorMsg("Could not fetch location");
      }
    })();
  }, []);

  // 3. Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(defaultCenterUSA, 1000);
        return true; // prevent exiting the app
      }
      return false; // allow default if no ref
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);


  const changeColorOfState = (state: State): ReactNode[] => {
    const output: ReactNode[] = [];
    state.polygons.forEach((polygon: Position[], index: number) => {
      output.push(
        <Polygon
          key={`${state.name}-${index}`}
          coordinates={polygon}
          fillColor={visitedStates.has(state.name) ? Colors.completedState : Colors.scheduledState} // Change color if state is visited
          strokeColor={Colors.strokeState}
          strokeWidth={0.5}
        />);

    })
    return output;
  }

  const zoomOutToUSA = () => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion(
      defaultCenterUSA,
      1000 // animation duration in ms
    );
  };

  const dispatch = useDispatch<AppDispatch>();

  const showMarker = (trip: Trip): ReactNode | null => {
    const lat = parseFloat(trip.latitude);
    const lon = parseFloat(trip.longitude);
    if (isNaN(lat) || isNaN(lon)) return null;

    return (
      <Marker
        key={trip.id}
        pinColor={
          trip.status === "Completed"
            ? Colors.completedDestination
            : trip.status === "Scheduled"
              ? Colors.scheduledDestination
              : Colors.otherDestination
        }
        coordinate={{
          latitude: lat,
          longitude: lon,
        }}
        title={`${trip.destination}`}
        description={`${trip.destination}, ${trip.state}`}
        onPress={() => {
          //console.log("Marker pressed:", trip);
          dispatch(setSelectedTrip(trip.id));
        }}
      />
    );
  }

  return (
    <>
      <MenuBar>
        <MenuIcon name="place" size={32} text="Details" onPress={() => router.push({
          pathname: "/tripDetails",
          params: { title: "Trip Details" },
        })} />
        <MenuIcon name="zoom-out-map" size={32} text="Zoom Out" onPress={() => zoomOutToUSA()} />
      </MenuBar>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        zoomControlEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        toolbarEnabled={true}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
        moveOnMarkerPress={false}
        showsScale={true}
        showsTraffic={true}
        showsIndoors={false}
        showsBuildings={false}
        initialRegion={
          defaultCenterUSA
        }
      >

        {trips.map(trip => showMarker(trip))}
        {(showStatesOverlay ? states.map(state => changeColorOfState(state)) : null)}

      </MapView>
    </>
  );
}

const styles = StyleSheet.create({

  map: {
    width: '100%',
    height: '92%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  inputbar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  search: {
    flex: 1,
    height: 55,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#f2f2f2'
  },
  button: {
    padding: 10,
    marginLeft: 4,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntext: {
    color: '#fff',
    fontSize: 16,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    marginHorizontal: 4,
  },

  picker: {
    height: 50,
    width: '100%',
  }
});


