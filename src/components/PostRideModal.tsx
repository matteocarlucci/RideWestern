import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRideStore } from "../state/rideStore";
import DateTimePicker from "@react-native-community/datetimepicker";

interface PostRideModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PostRideModal({ visible, onClose }: PostRideModalProps) {
  const currentUser = useRideStore((s) => s.currentUser);
  const addRide = useRideStore((s) => s.addRide);

  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalSeats, setTotalSeats] = useState("4");
  const [notes, setNotes] = useState("");

  const handlePost = () => {
    if (!currentUser) {
      return;
    }

    if (!destination.trim()) {
      return;
    }

    addRide({
      driverName: currentUser.name,
      driverId: currentUser.id,
      destination: destination.trim(),
      destinationCoordinates: { latitude: 43.0096, longitude: -81.2737 }, // Default to Western
      departureTime,
      availableSeats: parseInt(totalSeats),
      totalSeats: parseInt(totalSeats),
      notes: notes.trim() || undefined,
    });

    // Reset form
    setDestination("");
    setDepartureTime(new Date());
    setTotalSeats("4");
    setNotes("");
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDepartureTime(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-gray-50"
      >
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={28} color="#374151" />
            </Pressable>
            <Text className="text-lg font-bold text-gray-900">Post a Ride</Text>
            <Pressable
              onPress={handlePost}
              disabled={!destination.trim()}
            >
              <Text
                className={`text-lg font-semibold ${
                  !destination.trim()
                    ? "text-gray-400"
                    : "text-primary"
                }`}
              >
                Post
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1">
          <View className="px-4 py-6">
            {/* Destination */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Destination
              </Text>
              <View className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex-row items-center">
                <Ionicons name="school-outline" size={20} color="#6b7280" />
                <TextInput
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Where are you going?"
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Departure Time */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Departure Time
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex-row items-center"
              >
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text className="flex-1 ml-3 text-base text-gray-900">
                  {departureTime.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={departureTime}
                  mode="datetime"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Available Seats */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Available Seats
              </Text>
              <View className="flex-row">
                {["1", "2", "3", "4", "5"].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => setTotalSeats(num)}
                    className={`flex-1 py-3 mx-1 rounded-xl border ${
                      totalSeats === num
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        totalSeats === num ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {num}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </Text>
              <View className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional details..."
                  multiline
                  numberOfLines={4}
                  className="text-base text-gray-900"
                  placeholderTextColor="#9ca3af"
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Info Card */}
            <View className="bg-primary/5 rounded-xl p-4 flex-row">
              <Ionicons name="information-circle" size={24} color="#4A4063" />
              <Text className="flex-1 ml-3 text-sm text-secondary">
                Students will request rides and provide their pickup location. Price is automatically calculated at $2/km from Western University (minimum $4).
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
