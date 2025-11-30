import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRideStore } from "../state/rideStore";

const MapView = require("react-native-maps").default;
const Marker = require("react-native-maps").Marker;
const PROVIDER_DEFAULT = require("react-native-maps").PROVIDER_DEFAULT;

interface PostRideRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PostRideRequestModal({
  visible,
  onClose,
}: PostRideRequestModalProps) {
  const currentUser = useRideStore((s) => s.currentUser);
  const addPassengerRideRequest = useRideStore((s) => s.addPassengerRideRequest);

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState({
    latitude: 42.9849,
    longitude: -81.2453,
  });
  const [destination, setDestination] = useState("Western University - North Campus");
  const [destinationCoordinates] = useState({
    latitude: 43.0096,
    longitude: -81.2737,
  });
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState("");
  const [showPickupMap, setShowPickupMap] = useState(false);

  const handleSubmit = () => {
    if (!pickupLocation.trim()) {
      return;
    }

    addPassengerRideRequest({
      passengerId: currentUser?.id || "",
      passengerName: currentUser?.name || "",
      pickupLocation: pickupLocation.trim(),
      pickupCoordinates,
      destination,
      destinationCoordinates,
      departureTime,
      seats,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setPickupLocation("");
    setPickupCoordinates({
      latitude: 42.9849,
      longitude: -81.2453,
    });
    setDestination("Western University - North Campus");
    setDepartureTime(new Date());
    setSeats(1);
    setNotes("");
    onClose();
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setPickupCoordinates(coordinate);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-4 py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-gray-900">
                  Request a Ride
                </Text>
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={28} color="#6b7280" />
                </Pressable>
              </View>
              <Text className="text-sm text-gray-600 mt-1">
                Post your ride needs and let drivers offer you rides
              </Text>
            </View>

            <ScrollView className="flex-1 px-4 py-4">
              {/* Pickup Location */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Pickup Location *
                </Text>
                <View className="flex-row gap-2">
                  <TextInput
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChangeText={setPickupLocation}
                    className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
                  />
                  <Pressable
                    onPress={() => setShowPickupMap(true)}
                    className="bg-primary rounded-xl px-4 py-3 justify-center items-center"
                  >
                    <Ionicons name="map" size={20} color="white" />
                  </Pressable>
                </View>
                {pickupCoordinates && (
                  <Text className="text-xs text-gray-500 mt-1">
                    📍 {pickupCoordinates.latitude.toFixed(4)}, {pickupCoordinates.longitude.toFixed(4)}
                  </Text>
                )}
              </View>

              {/* Destination */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Destination *
                </Text>
                <TextInput
                  placeholder="Western University"
                  value={destination}
                  onChangeText={setDestination}
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
                />
              </View>

              {/* Departure Date */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Departure Date *
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200"
                >
                  <Text className="text-base text-gray-900">
                    {departureTime.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </Pressable>
              </View>

              {/* Departure Time */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Departure Time *
                </Text>
                <Pressable
                  onPress={() => setShowTimePicker(true)}
                  className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200"
                >
                  <Text className="text-base text-gray-900">
                    {departureTime.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                </Pressable>
              </View>

              {/* Number of Seats */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Number of Seats Needed *
                </Text>
                <View className="flex-row gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Pressable
                      key={num}
                      onPress={() => setSeats(num)}
                      className={`flex-1 py-3 rounded-xl border-2 ${
                        seats === num
                          ? "border-primary bg-primary"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          seats === num ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {num}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </Text>
                <TextInput
                  placeholder="Any preferences or requirements..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
                  style={{ textAlignVertical: "top" }}
                />
              </View>
            </ScrollView>

            {/* Submit Button */}
            <View className="px-4 py-4 border-t border-gray-200">
              <Pressable
                onPress={handleSubmit}
                disabled={!pickupLocation.trim() || !destination.trim()}
                className={`rounded-xl py-4 items-center ${
                  !pickupLocation.trim() || !destination.trim()
                    ? "bg-gray-300"
                    : "bg-primary"
                }`}
              >
                <Text className="text-white text-lg font-bold">
                  Post Ride Request
                </Text>
              </Pressable>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={departureTime}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDepartureTime(selectedDate);
                  }
                }}
              />
            )}

            {/* Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={departureTime}
                mode="time"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) {
                    setDepartureTime(selectedDate);
                  }
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Pickup Location Map Modal */}
      <Modal
        visible={showPickupMap}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPickupMap(false)}
      >
        <View className="flex-1 bg-white">
          <View className="px-4 py-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                Select Pickup Location
              </Text>
              <Pressable onPress={() => setShowPickupMap(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </Pressable>
            </View>
            <Text className="text-sm text-gray-600 mt-1">
              Tap anywhere on the map to set your pickup location
            </Text>
          </View>

          <View className="flex-1">
            <MapView
              provider={PROVIDER_DEFAULT}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: pickupCoordinates.latitude,
                longitude: pickupCoordinates.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={handleMapPress}
              showsUserLocation={true}
            >
              <Marker coordinate={pickupCoordinates}>
                <View
                  style={{
                    backgroundColor: "#4A4063",
                    padding: 10,
                    borderRadius: 25,
                    borderWidth: 3,
                    borderColor: "white",
                  }}
                >
                  <Ionicons name="location" size={24} color="white" />
                </View>
              </Marker>
            </MapView>
          </View>

          <View className="px-4 py-4 bg-white border-t border-gray-200">
            <Pressable
              onPress={() => setShowPickupMap(false)}
              className="bg-primary rounded-xl py-4 items-center"
            >
              <Text className="text-white text-lg font-bold">Confirm Location</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
