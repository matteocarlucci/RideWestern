import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRideStore } from "../state/rideStore";

export default function ProfileScreen() {
  const currentUser = useRideStore((s) => s.currentUser);
  const setCurrentUser = useRideStore((s) => s.setCurrentUser);
  const rides = useRideStore((s) => s.rides);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [school, setSchool] = useState(currentUser?.school || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");

  const myRidesAsDriver = rides.filter(
    (ride) => ride.driverId === currentUser?.id
  ).length;

  const myRidesAsPassenger = rides.filter((ride) =>
    ride.acceptedPassengers.some((p) => p.riderId === currentUser?.id)
  ).length;

  const handleSave = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name,
        school,
        phone,
      });
    } else {
      setCurrentUser({
        id: Math.random().toString(36).substr(2, 9),
        name,
        school,
        phone,
        email: "",
        ridesOffered: 0,
        ridesTaken: 0,
      });
    }
    setIsEditing(false);
  };

  if (!currentUser && !isEditing) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="person-circle-outline" size={100} color="#d1d5db" />
        <Text className="text-2xl font-bold text-gray-900 mt-4">
          Welcome to RideShare
        </Text>
        <Text className="text-gray-600 text-center mt-2 mb-6">
          Set up your profile to start sharing rides with fellow students
        </Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="bg-primary rounded-xl px-8 py-4"
        >
          <Text className="text-white font-semibold text-lg">
            Create Profile
          </Text>
        </Pressable>
      </View>
    );
  }

  if (isEditing) {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-900 mb-6">
            {currentUser ? "Edit Profile" : "Create Profile"}
          </Text>

          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              School
            </Text>
            <TextInput
              value={school}
              onChangeText={setSchool}
              placeholder="Enter your school name"
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="bg-white rounded-2xl p-4 mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <Pressable
            onPress={handleSave}
            className="bg-primary rounded-xl py-4 items-center mb-3"
          >
            <Text className="text-white font-semibold text-lg">Save Profile</Text>
          </Pressable>

          {currentUser && (
            <Pressable
              onPress={() => setIsEditing(false)}
              className="bg-gray-200 rounded-xl py-4 items-center"
            >
              <Text className="text-gray-700 font-semibold text-lg">Cancel</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="bg-primary px-4 pt-6 pb-20">
        <View className="items-center">
          <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-4">
            <Text className="text-4xl font-bold text-primary">
              {currentUser?.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-white text-2xl font-bold">
            {currentUser?.name}
          </Text>
          <Text className="text-primary-light text-base mt-1">
            {currentUser?.school}
          </Text>
        </View>
      </View>

      <View className="px-4 -mt-12">
        {/* Stats Card */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <View className="flex-row">
            <View className="flex-1 items-center py-3 border-r border-gray-200">
              <Text className="text-3xl font-bold text-gray-900">
                {myRidesAsDriver}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">Rides Offered</Text>
            </View>
            <View className="flex-1 items-center py-3">
              <Text className="text-3xl font-bold text-gray-900">
                {myRidesAsPassenger}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">Rides Taken</Text>
            </View>
          </View>
        </View>

        {/* Profile Info */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Profile Information
            </Text>
            <Pressable onPress={() => setIsEditing(true)}>
              <Ionicons name="pencil" size={20} color="#4A4063" />
            </Pressable>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-1">School</Text>
            <Text className="text-base text-gray-900 font-medium">
              {currentUser?.school}
            </Text>
          </View>

          {currentUser?.phone && (
            <View>
              <Text className="text-sm text-gray-500 mb-1">Phone</Text>
              <Text className="text-base text-gray-900 font-medium">
                {currentUser.phone}
              </Text>
            </View>
          )}
        </View>

        {/* Settings Options */}
        <View className="bg-white rounded-2xl mb-4">
          <Pressable className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={22} color="#6b7280" />
              <Text className="text-base text-gray-900 ml-3">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark-outline" size={22} color="#6b7280" />
              <Text className="text-base text-gray-900 ml-3">Privacy & Safety</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>

          <Pressable className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-row items-center">
              <Ionicons name="help-circle-outline" size={22} color="#6b7280" />
              <Text className="text-base text-gray-900 ml-3">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
