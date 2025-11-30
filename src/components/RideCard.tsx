import { View, Text, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ride } from "../types/ride";
import { useRideStore } from "../state/rideStore";
import { format } from "date-fns";
import { calculateRidePrice } from "../utils/pricing";

// Dynamic import for react-native-maps to avoid type checking issues
const MapView = require("react-native-maps").default;
const Marker = require("react-native-maps").Marker;
const PROVIDER_DEFAULT = require("react-native-maps").PROVIDER_DEFAULT;

interface RideCardProps {
  ride: Ride;
  onRequestPress?: () => void;
}

export default function RideCard({ ride, onRequestPress }: RideCardProps) {
  const currentUser = useRideStore((s) => s.currentUser);
  const requestRide = useRideStore((s) => s.requestRide);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const myRequest = ride.requests.find((r) => r.riderId === currentUser?.id);
  const myAcceptedRequest = ride.acceptedPassengers.find(
    (r) => r.riderId === currentUser?.id
  );

  const handleRequestRide = () => {
    if (!currentUser || !pickupLocation.trim() || !selectedCoords) {
      return;
    }

    const { price, distance } = calculateRidePrice(selectedCoords);
    const pickupLocationValue = pickupLocation.trim();
    const pickupCoordsValue = selectedCoords;

    const requestId = requestRide(ride.id, {
      riderId: currentUser.id,
      riderName: currentUser.name,
      pickupLocation: pickupLocationValue,
      pickupCoordinates: pickupCoordsValue,
      calculatedPrice: price,
      distanceKm: distance,
    });

    setShowRequestModal(false);
    setPickupLocation("");
    setSelectedCoords(null);

    // Special case for MoCheddar67 - navigate to live tracking after state update
    if (ride.driverName === "MoCheddar67") {
      setTimeout(() => {
        (navigation as any).navigate("LiveTracking", {
          pickupLocation: pickupLocationValue,
          pickupCoordinates: pickupCoordsValue,
          driverName: ride.driverName,
          destination: ride.destination,
          calculatedPrice: price,
          rideId: ride.id,
          requestId: requestId,
        });
      }, 100);
    } else {
      // Normal flow - navigate to Rides tab
      navigation.navigate("Rides" as never);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
  };

  const getRequestStatus = () => {
    if (myAcceptedRequest) {
      return { text: "Accepted", color: "green", icon: "checkmark-circle" };
    }
    if (myRequest?.status === "pending") {
      return { text: "Pending", color: "yellow", icon: "time" };
    }
    if (myRequest?.status === "rejected") {
      return { text: "Rejected", color: "red", icon: "close-circle" };
    }
    return null;
  };

  const statusInfo = getRequestStatus();

  return (
    <>
      <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-200">
        {/* Driver Info */}
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-3">
            <Text className="text-lg font-bold text-primary">
              {ride.driverName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">
              {ride.driverName}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text className="text-sm text-gray-600 ml-1">4.8</Text>
            </View>
          </View>
        </View>

        {/* Destination */}
        <View className="mb-4">
          <View className="flex-row items-start">
            <View className="w-3 h-3 rounded-full bg-primary mr-3 mt-1" />
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">GOING TO</Text>
              <Text className="text-base font-semibold text-gray-900">
                {ride.destination}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Row */}
        <View className="flex-row items-center justify-between pt-4 border-t border-gray-100 mb-4">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-2">
              {format(new Date(ride.departureTime), "MMM d, h:mm a")}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-2">
              {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {ride.notes && (
          <View className="bg-gray-50 rounded-xl p-3 mb-4">
            <Text className="text-sm text-gray-700">{ride.notes}</Text>
          </View>
        )}

        {/* Request Button or Status */}
        {ride.status === "cancelled" ? (
          <View className="rounded-xl py-3 items-center flex-row justify-center border bg-red-50 border-red-200">
            <Ionicons name="close-circle" size={20} color="#dc2626" />
            <Text className="font-semibold ml-2 text-red-700">
              Ride Cancelled by Driver
            </Text>
          </View>
        ) : statusInfo ? (
          <View
            className={`rounded-xl py-3 items-center flex-row justify-center border ${
              statusInfo.color === "green"
                ? "bg-green-50 border-green-200"
                : statusInfo.color === "yellow"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <Ionicons
              name={statusInfo.icon as any}
              size={20}
              color={
                statusInfo.color === "green"
                  ? "#16a34a"
                  : statusInfo.color === "yellow"
                  ? "#ca8a04"
                  : "#dc2626"
              }
            />
            <Text
              className={`font-semibold ml-2 ${
                statusInfo.color === "green"
                  ? "text-green-700"
                  : statusInfo.color === "yellow"
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              {statusInfo.text}
              {myAcceptedRequest && ` - $${myAcceptedRequest.calculatedPrice.toFixed(2)}`}
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() => setShowRequestModal(true)}
            disabled={ride.availableSeats === 0}
            className={`rounded-xl py-3 items-center ${
              ride.availableSeats === 0 ? "bg-gray-200" : "bg-primary"
            }`}
          >
            <Text
              className={`font-semibold text-base ${
                ride.availableSeats === 0 ? "text-gray-500" : "text-white"
              }`}
            >
              {ride.availableSeats === 0 ? "Full" : "Request Ride"}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Request Modal */}
      <Modal
        visible={showRequestModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View
            className="bg-white border-b border-gray-200 pb-3 px-4"
            style={{ paddingTop: insets.top + 12 }}
          >
            <View className="flex-row items-center justify-between">
              <Pressable onPress={() => setShowRequestModal(false)}>
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
              <Text className="text-lg font-bold text-gray-900">
                Set Pickup Location
              </Text>
              <Pressable
                onPress={handleRequestRide}
                disabled={!pickupLocation.trim() || !selectedCoords}
              >
                <Text
                  className={`text-lg font-semibold ${
                    !pickupLocation.trim() || !selectedCoords
                      ? "text-gray-400"
                      : "text-primary"
                  }`}
                >
                  Send
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Map */}
          <View className="flex-1">
            <MapView
              provider={PROVIDER_DEFAULT}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: 42.9849,
                longitude: -81.2453,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              onPress={handleMapPress}
              showsUserLocation={true}
            >
              {selectedCoords && (
                <Marker coordinate={selectedCoords}>
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
              )}
            </MapView>

            {/* Instructions */}
            {!selectedCoords && (
              <View
                className="absolute top-4 left-4 right-4 bg-white rounded-xl p-4 shadow-md"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="information-circle" size={24} color="#4A4063" />
                  <Text className="flex-1 ml-3 text-sm text-gray-900">
                    Tap anywhere on the map to set your pickup location
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Bottom Card */}
          <View className="bg-white border-t border-gray-200">
            <ScrollView className="max-h-64">
              <View className="px-4 py-4">
                {/* Price Info */}
                {selectedCoords && (
                  <View className="bg-primary/5 rounded-xl p-4 mb-4">
                    <Text className="text-secondary font-semibold mb-2">
                      Estimated Price
                    </Text>
                    <Text className="text-primary text-3xl font-bold mb-2">
                      ${calculateRidePrice(selectedCoords).price.toFixed(2)}
                    </Text>
                    <Text className="text-primary-dark text-sm">
                      {calculateRidePrice(selectedCoords).distance.toFixed(2)} km from Western University
                    </Text>
                  </View>
                )}

                {/* Location Name Input */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Location Name
                  </Text>
                  <TextInput
                    value={pickupLocation}
                    onChangeText={setPickupLocation}
                    placeholder="e.g., My Apartment, Coffee Shop"
                    className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900"
                    placeholderTextColor="#9ca3af"
                  />
                  <Text className="text-xs text-gray-500 mt-2">
                    Help the driver find you by adding a landmark or address name
                  </Text>
                </View>

                {/* Coordinates Display */}
                {selectedCoords && (
                  <View className="bg-gray-50 rounded-xl p-3">
                    <Text className="text-xs text-gray-600">
                      Coordinates: {selectedCoords.latitude.toFixed(6)}, {selectedCoords.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
