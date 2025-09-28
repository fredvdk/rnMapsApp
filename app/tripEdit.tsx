import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    TextInput,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, View } from "@/components/Themed";
import { Trip } from "@/models/Trip";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { updateTrip, createTrip } from "@/services/TripService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
    updateTrip as updateTripInState,
    addTrip as addTripInState,
} from "@/store/slices/tripsSlice";

export default function TripEdit() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { tripId } = useLocalSearchParams();

    // Find existing trip or create defaults
    const tripFromState: Trip | undefined = useSelector((state: any) =>
        state.trips.trips.find((t: Trip) => t.id === tripId)
    );

    const trip = tripFromState ?? {
        id: undefined,
        destination: "",
        state: "",
        from: new Date().toISOString(),
        till: new Date().toISOString(),
        status: "Scheduled",
        hotel: "",
        hotelCost: 0,
        transportMode: "",
        transportCost: 0,
        notes: "",
    };

    // Editable state fields
    const [destination, setDestination] = useState(trip.destination);
    const [from, setFrom] = useState(new Date(trip.from));
    const [till, setTill] = useState(new Date(trip.till));
    const [status, setStatus] = useState(trip.status);
    const [hotel, setHotel] = useState(trip.hotel);
    const [hotelCost, setHotelCost] = useState(String(trip.hotelCost || ""));
    const [transportMode, setTransportMode] = useState(trip.transportMode);
    const [transportCost, setTransportCost] = useState(
        String(trip.transportCost || "")
    );
    const [notes, setNotes] = useState(trip.notes);

    // Date pickers
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showTillPicker, setShowTillPicker] = useState(false);

    const saveTrip = async () => {
        try {
            const tripToSave: any = {
                ...trip,
                destination,
                from: from.toISOString() || new Date().toISOString(),
                till: till.toISOString() || new Date().toISOString(),
                status: status || "Scheduled",
                hotel: hotel || "",
                hotelCost: hotelCost ? parseFloat(hotelCost) : 0,
                transportMode: transportMode || "",
                transportCost: transportCost ? parseFloat(transportCost) : 0,
                notes: notes || "",
                updated: new Date().toISOString(),
                id: trip.id || undefined,
            };

            if (trip.id) {
                await updateTrip(tripToSave);
                console.log('Updated trip:', tripToSave);
                dispatch(updateTripInState(tripToSave));
            } else {
                try {
                    const newTrip = await createTrip(tripToSave);
                    console.log('trip to save :', JSON.stringify(tripToSave));
                    console.log('Created trip:', newTrip);
                } catch (err) {
                    console.error('Failed to create trip', err); // will show real cause
                }
                
               // dispatch(addTripInState(newTrip));
            }

            Alert.alert("Trip saved!", "", [{ text: "OK", onPress: () => router.back() }]);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to save trip.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, paddingBottom: 50 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Stack.Screen options={{ title: tripId ? "Edit Trip" : "New Trip" }} />

                    <Text style={styles.title}>
                        {tripId ? `${destination || trip.destination}` : "Nieuwe trip"}
                    </Text>

                    {/* Destination */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Bestemming (stad):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Bestemming"
                            value={destination}
                            onChangeText={setDestination}
                        />
                    </View>

                    {/* From */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Van:</Text>
                        <Pressable onPress={() => setShowFromPicker(true)}>
                            <TextInput
                                style={styles.input}
                                value={from.toLocaleDateString()}
                                editable={false}
                                pointerEvents="none"
                            />
                        </Pressable>
                        {showFromPicker && (
                            <DateTimePicker
                                value={from}
                                mode="date"
                                display="default"
                                onChange={(event, date) => {
                                    setShowFromPicker(false);
                                    if (date) setFrom(date);
                                }}
                            />
                        )}
                    </View>

                    {/* Till */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Tot:</Text>
                        <Pressable onPress={() => setShowTillPicker(true)}>
                            <TextInput
                                style={styles.input}
                                value={till.toLocaleDateString()}
                                editable={false}
                                pointerEvents="none"
                            />
                        </Pressable>
                        {showTillPicker && (
                            <DateTimePicker
                                value={till}
                                mode="date"
                                display="default"
                                onChange={(event, date) => {
                                    setShowTillPicker(false);
                                    if (date) setTill(date);
                                }}
                            />
                        )}
                    </View>

                    {/* Status Dropdown */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Status:</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={status}
                                onValueChange={(itemValue) => setStatus(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Scheduled" value="Scheduled" />
                                <Picker.Item label="Completed" value="Completed" />
                            </Picker>
                        </View>
                    </View>

                    {/* Hotel */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Hotel:</Text>
                        <TextInput style={styles.input} value={hotel} onChangeText={setHotel} />
                    </View>

                    {/* Hotel cost */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Hotelkost (€):</Text>
                        <TextInput
                            style={styles.input}
                            value={hotelCost}
                            onChangeText={setHotelCost}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    {/* Transport */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Transport:</Text>
                        <TextInput
                            style={styles.input}
                            value={transportMode}
                            onChangeText={setTransportMode}
                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Transportkost (€):</Text>
                        <TextInput
                            style={styles.input}
                            value={transportCost}
                            onChangeText={setTransportCost}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    {/* Notes */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Notities:</Text>
                        <TextInput
                            multiline
                            numberOfLines={5}
                            style={[styles.input, { height: 80 }]}
                            value={notes}
                            onChangeText={setNotes}
                            scrollEnabled={true}
                        />
                    </View>

                    <Pressable style={styles.saveButton} onPress={saveTrip}>
                        <Text style={styles.saveButtonText}>💾 Opslaan</Text>
                    </Pressable>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },
    row: {
        marginBottom: 14,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    input: {
        padding: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 6,
        borderColor: "#ccc",
        borderWidth: 1,
        fontSize: 16,
    },
    saveButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
    },
    pickerWrapper: {
        backgroundColor: "#f2f2f2",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        overflow: "hidden",
    },
    picker: {
        height: 64,
        width: "100%",
    },
});
