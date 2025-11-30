import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRideStore } from "../state/rideStore";
import RideCard from "../components/RideCard";
import PostRideModal from "../components/PostRideModal";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPostRideModalVisible, setIsPostRideModalVisible] = useState(false);
  const [filterDestination, setFilterDestination] = useState("all");

  const rides = useRideStore((s) => s.rides);
  const currentUser = useRideStore((s) => s.currentUser);
  const initializeMockData = useRideStore((s) => s.initializeMockData);

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const availableRides = rides.filter(
    (ride) =>
      ride.status === "active" &&
      ride.availableSeats > 0 &&
      ride.driverId !== currentUser?.id
  );

  const filteredRides = availableRides.filter((ride) => {
    const matchesSearch =
      ride.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.driverName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterDestination === "all" || ride.destination === filterDestination;

    return matchesSearch && matchesFilter;
  });

  const destinations = Array.from(new Set(availableRides.map((r) => r.destination)));

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 pt-3 pb-2">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-3">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search destination or driver"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-base text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            onPress={() => setFilterDestination("all")}
            className={`px-4 py-2 rounded-full mr-2 ${
              filterDestination === "all" ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <Text
              className={`font-medium ${
                filterDestination === "all" ? "text-white" : "text-gray-700"
              }`}
            >
              All
            </Text>
          </Pressable>
          {destinations.map((dest) => (
            <Pressable
              key={dest}
              onPress={() => setFilterDestination(dest)}
              className={`px-4 py-2 rounded-full mr-2 ${
                filterDestination === dest ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <Text
                className={`font-medium ${
                  filterDestination === dest ? "text-white" : "text-gray-700"
                }`}
              >
                {dest}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Content List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {filteredRides.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="car-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No rides available
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-8">
              Be the first to post a ride to campus
            </Text>
          </View>
        ) : (
          filteredRides.map((ride) => <RideCard key={ride.id} ride={ride} />)
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <Pressable
          onPress={() => setIsPostRideModalVisible(true)}
          className="bg-primary rounded-full w-16 h-16 items-center justify-center shadow-lg"
          style={{
            shadowColor: "#4A4063",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="car" size={28} color="#ffffff" />
        </Pressable>
      </View>

      <PostRideModal
        visible={isPostRideModalVisible}
        onClose={() => setIsPostRideModalVisible(false)}
      />
    </View>
  );
}
