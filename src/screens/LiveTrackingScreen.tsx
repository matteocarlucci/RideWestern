import { View, Text, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRideStore } from "../state/rideStore";

// Dynamic import for react-native-maps
const MapView = require("react-native-maps").default;
const Marker = require("react-native-maps").Marker;
const PROVIDER_DEFAULT = require("react-native-maps").PROVIDER_DEFAULT;

// MoCheddar67's current location at Oxford & Wharncliffe intersection
const DRIVER_LOCATION = {
  latitude: 42.992135,
  longitude: -81.264951,
};

export default function LiveTrackingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { pickupLocation, pickupCoordinates, driverName, destination, calculatedPrice, rideId, requestId } =
    route.params as any;

  const cancelRequest = useRideStore((s) => s.cancelRequest);
  const [eta, setEta] = useState(5); // 5 minutes ETA

  useEffect(() => {
    // Simulate countdown
    const interval = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCancelRide = () => {
    if (rideId && requestId) {
      cancelRequest(rideId, requestId);
    }
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-primary border-b border-gray-200 pb-3 px-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#ffffff" />
          </Pressable>
          <Text className="text-lg font-bold text-white">Tracking Your Ride</Text>
          <View style={{ width: 28 }} />
        </View>
      </View>

      {/* Map */}
      <View className="flex-1">
        <MapView
          provider={PROVIDER_DEFAULT}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: (DRIVER_LOCATION.latitude + pickupCoordinates.latitude) / 2,
            longitude: (DRIVER_LOCATION.longitude + pickupCoordinates.longitude) / 2,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={false}
        >
          {/* Driver Location Marker */}
          <Marker coordinate={DRIVER_LOCATION}>
            <View
              style={{
                backgroundColor: "#4A4063",
                padding: 12,
                borderRadius: 30,
                borderWidth: 4,
                borderColor: "white",
              }}
            >
              <Ionicons name="car" size={28} color="white" />
            </View>
          </Marker>

          {/* Pickup Location Marker */}
          <Marker coordinate={pickupCoordinates}>
            <View
              style={{
                backgroundColor: "#10b981",
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

        {/* Driver Info Card */}
        <View
          className="absolute top-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center mb-3">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Text className="text-2xl font-bold text-primary">
                {driverName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">{driverName}</Text>
              <Text className="text-sm text-gray-600">is on the way!</Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-primary">{eta}</Text>
              <Text className="text-xs text-gray-500">min</Text>
            </View>
          </View>

          <View className="bg-green-50 rounded-xl p-3 border border-green-200">
            <Text className="text-xs text-green-700 font-semibold mb-1">
              DRIVER LOCATION
            </Text>
            <Text className="text-sm text-gray-900 font-medium">
              McDonald&apos;s - Oxford & Wharncliffe
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Info Card */}
      <View
        className="bg-white border-t border-gray-200 px-4"
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
      >
        <View className="mb-4">
          <Text className="text-xs text-gray-500 mb-1">YOUR PICKUP LOCATION</Text>
          <Text className="text-base font-semibold text-gray-900">{pickupLocation}</Text>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">DESTINATION</Text>
            <Text className="text-sm font-medium text-gray-900">{destination}</Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-gray-500 mb-1">FARE</Text>
            <Text className="text-xl font-bold text-primary">
              ${calculatedPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="bg-primary/5 rounded-xl p-3 flex-row items-center mb-4">
          <Ionicons name="checkmark-circle" size={24} color="#4A4063" />
          <Text className="flex-1 ml-3 text-sm text-gray-700">
            Your ride has been confirmed. {driverName} will arrive in approximately {eta}{" "}
            minutes.
          </Text>
        </View>

        {/* Cancel Ride Button */}
        <Pressable
          onPress={handleCancelRide}
          className="bg-red-600 rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold text-base">Cancel This Ride</Text>
        </Pressable>
      </View>
    </View>
  );
}
