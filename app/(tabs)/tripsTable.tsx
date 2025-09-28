import React from 'react';
import { FlatList, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Trip } from '@/models/Trip';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSelectedTrip } from '@/store/slices/tripsSlice';
import MenuBar from '@/components/menuBar';
import MenuIcon from '@/components/menuIcon';

const TripsTable = () => {
  const [searchText, setSearchText] = React.useState('');

  const trips: Trip[] = useSelector((state: RootState) => state.trips.trips);

  const normalizedSearch = searchText.toLowerCase().trimEnd();

  // 🛡️ null-safe filtering
  const filteredTrips = trips.filter(trip => {
    const dest = (trip.destination || '').toLowerCase();
    const state = (trip.state || '').toLowerCase();
    const status = (trip.status || '').toLowerCase();
    return (
      dest.includes(normalizedSearch) ||
      state.includes(normalizedSearch) ||
      status.includes(normalizedSearch)
    );
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const onPressTrip = (trip: Trip) => {
    // Navigate to details and set selected trip
    router.push(`/tripDetails?tripId=${trip?.id}`);
    dispatch(setSelectedTrip(trip.id));
  };

  const renderItem = ({ item }: { item: Trip }) => (
    <Text
      style={[
        styles.listItem,
        { fontWeight: item.status === 'Scheduled' ? 'bold' : 'normal' },
      ]}
      onPress={() => onPressTrip(item)}
    >
      {item.destination || 'No destination'}, {item.state || '—'}
    </Text>
  );

  return (
    <View style={styles.container}>
      <MenuBar>
        <TextInput
          style={styles.search}
          placeholder="Search trips..."
          onChangeText={setSearchText}
          value={searchText}
        />
        <MenuIcon
          name="add"
          size={32}
          text="New trip"
          onPress={() => router.push('/tripEdit')}
        />
      </MenuBar>

      <FlatList
        style={{ width: '90%' }}
        data={filteredTrips}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 0 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  search: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    marginLeft: 0,
    width: '70%',
  },
});

export default TripsTable;
