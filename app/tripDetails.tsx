import { ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { Text, View } from '@/components/Themed';
import { Trip } from '@/models/Trip';
import { formatDateToBEL } from '@/utils/utils';
import { navigate } from 'expo-router/build/global-state/routing';
import MenuBar from '@/components/menuBar';
import MenuIcon from '@/components/menuIcon';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

export default function tripDetails() {
  const tripId: string = useSelector((state: any) => state.trips.selectedTripId);
  const trip: Trip | null = useSelector((state: any) =>
    state.trips.trips.find((t: Trip) => t.id === tripId) || null
  );

  const router = useRouter();

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trip niet gevonden</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{trip.destination}, {trip.state}</Text>
        <MenuIcon name="edit" text="Edit" size={32} onPress={() => router.push({
          pathname: '/tripEdit',
          params: { tripId: trip.id }, // for edit
        })} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{trip.status}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Periode:</Text>
        <Text style={styles.value}>
          {formatDateToBEL(trip.from)} tot {formatDateToBEL(trip.till)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Hotel:</Text>
        <Text style={styles.value}>{trip.hotel} (€{trip.hotelCost})</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Transport:</Text>
        <Text style={styles.value}>{trip.transportMode} (€{trip.transportCost})</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Coördinaten:</Text>
        <Text style={styles.value}>
          Lat: {parseFloat(trip.latitude).toFixed(4)}, Lon: {parseFloat(trip.longitude).toFixed(4)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Notities:</Text>
        <Text style={styles.value}>{trip.notes || '-'}</Text>
      </View>

      <MenuBar>
      </MenuBar>
      <View style={styles.footer}>
        <Text style={styles.meta}>Aangemaakt: {formatDateToBEL(trip.created)}</Text>
        <Text style={styles.meta}>Laatste update: {formatDateToBEL(trip.updated)}</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    marginBottom: 14,
    marginEnd: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#444',
  },
  footer: {
    marginTop: 24,
  },
  meta: {
    fontSize: 13,
    color: '#999',
  },
  button:
  {
    padding: 20, backgroundColor: '#f0f0f0', borderRadius: 4,
    borderWidth: 1, borderColor: '#ddd',
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  }

});