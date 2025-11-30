import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRideStore } from "../state/rideStore";

// Dynamic import for react-native-maps to avoid type checking issues
const MapView = require("react-native-maps").default;
const Marker = require("react-native-maps").Marker;
const PROVIDER_DEFAULT = require("react-native-maps").PROVIDER_DEFAULT;

export default function MapScreen() {
  const rides = useRideStore((s) => s.rides);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  // London, Ontario coordinates
  const londonOntario = {
    latitude: 42.9849,
    longitude: -81.2453,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  const activeRides = rides.filter(
    (ride) =>
      ride.status === "active" &&
      ride.destinationCoordinates
  );

  const selectedRideData = activeRides.find((r) => r.id === selectedRide);

  return (
    <View className="flex-1">
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={londonOntario}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {activeRides.map((ride) => {
          const isSelected = ride.id === selectedRide;

          return (
            <View key={ride.id}>
              {/* Destination Marker (Campus) */}
              {ride.destinationCoordinates && (
                <Marker
                  coordinate={ride.destinationCoordinates}
                  onPress={() => setSelectedRide(ride.id)}
                >
                  <View
                    style={{
                      backgroundColor: isSelected ? "#4A4063" : "#6B5B7F",
                      padding: 8,
                      borderRadius: 20,
                      borderWidth: 3,
                      borderColor: "white",
                    }}
                  >
                    <Ionicons name="school" size={20} color="white" />
                  </View>
                </Marker>
              )}

              {/* Show accepted passenger pickup locations for selected ride */}
              {isSelected &&
                ride.acceptedPassengers.map((passenger) => (
                  <Marker
                    key={passenger.id}
                    coordinate={passenger.pickupCoordinates}
                  >
                    <View
                      style={{
                        backgroundColor: "#16a34a",
                        padding: 6,
                        borderRadius: 15,
                        borderWidth: 2,
                        borderColor: "white",
                      }}
                    >
                      <Ionicons name="person" size={16} color="white" />
                    </View>
                  </Marker>
                ))}
            </View>
          );
        })}
      </MapView>

      {/* Info Card for Selected Ride */}
      {selectedRideData && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <View className="px-4 py-4">
            {/* Close Button */}
            <Pressable
              onPress={() => setSelectedRide(null)}
              className="absolute top-3 right-3 z-10"
            >
              <Ionicons name="close-circle" size={28} color="#9ca3af" />
            </Pressable>

            {/* Driver Info */}
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Text className="text-lg font-bold text-primary">
                  {selectedRideData.driverName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {selectedRideData.driverName}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text className="text-sm text-gray-600 ml-1">4.8</Text>
                </View>
              </View>
            </View>

            {/* Destination */}
            <View className="mb-3">
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 rounded-full bg-primary mr-3" />
                <Text className="text-sm font-semibold text-gray-900 flex-1">
                  {selectedRideData.destination}
                </Text>
              </View>
            </View>

            {/* Info Row */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text className="text-sm text-gray-600 ml-1">
                  {new Date(selectedRideData.departureTime).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={16} color="#6b7280" />
                <Text className="text-sm text-gray-600 ml-1">
                  {selectedRideData.availableSeats} seats left
                </Text>
              </View>
            </View>

            {/* Accepted Passengers */}
            {selectedRideData.acceptedPassengers.length > 0 && (
              <View className="mb-3 bg-green-50 rounded-xl p-3">
                <Text className="text-sm font-semibold text-green-900 mb-2">
                  {selectedRideData.acceptedPassengers.length} Passenger(s) Accepted
                </Text>
                {selectedRideData.acceptedPassengers.map((p) => (
                  <Text key={p.id} className="text-xs text-green-700">
                    • {p.riderName} - ${p.calculatedPrice.toFixed(2)}
                  </Text>
                ))}
              </View>
            )}

            {/* View Details Button */}
            <Pressable className="bg-primary rounded-xl py-3 items-center">
              <Text className="text-white font-semibold text-base">
                Request Ride
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Legend */}
      {!selectedRideData && (
        <View
          className="absolute top-4 right-4 bg-white rounded-2xl p-4 shadow-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View className="flex-row items-center mb-2">
            <View className="w-4 h-4 rounded-full bg-primary/50 mr-2" />
            <Text className="text-xs text-gray-700">Campus Destinations</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-green-500 mr-2" />
            <Text className="text-xs text-gray-700">Pickup Locations</Text>
          </View>
        </View>
      )}
    </View>
  );
}
