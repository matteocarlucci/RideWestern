import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRideStore } from "../state/rideStore";
import { Ride, PassengerRideRequest } from "../types/ride";
import { format } from "date-fns";

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState<"driving" | "requests" | "posted">("driving");
  const rides = useRideStore((s) => s.rides);
  const currentUser = useRideStore((s) => s.currentUser);
  const getMyRequests = useRideStore((s) => s.getMyRequests);
  const acceptRequest = useRideStore((s) => s.acceptRequest);
  const rejectRequest = useRideStore((s) => s.rejectRequest);
  const cancelRequest = useRideStore((s) => s.cancelRequest);
  const cancelRide = useRideStore((s) => s.cancelRide);
  const getMyPassengerRideRequests = useRideStore((s) => s.getMyPassengerRideRequests);
  const cancelPassengerRideRequest = useRideStore((s) => s.cancelPassengerRideRequest);

  // Filter out cancelled rides from My Rides view
  const myRidesAsDriver = rides.filter(
    (ride) => ride.driverId === currentUser?.id && ride.status !== "cancelled"
  );
  const myRequests = getMyRequests();
  const myPostedRequests = getMyPassengerRideRequests();

  // All driver rides posted by current user (active only, no cancelled)
  const myPostedRides = rides.filter(
    (ride) => ride.driverId === currentUser?.id && ride.status === "active"
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Tab Selector */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <Pressable
            onPress={() => setActiveTab("driving")}
            className={`flex-1 py-2 rounded-md ${
              activeTab === "driving" ? "bg-white" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold text-xs ${
                activeTab === "driving" ? "text-primary" : "text-gray-600"
              }`}
            >
              My Rides
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("requests")}
            className={`flex-1 py-2 rounded-md ${
              activeTab === "requests" ? "bg-white" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold text-xs ${
                activeTab === "requests" ? "text-primary" : "text-gray-600"
              }`}
            >
              Join Requests ({myRequests.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("posted")}
            className={`flex-1 py-2 rounded-md ${
              activeTab === "posted" ? "bg-white" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold text-xs ${
                activeTab === "posted" ? "text-primary" : "text-gray-600"
              }`}
            >
              Posted ({myPostedRides.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 pt-4">
        {activeTab === "driving" ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="information-circle-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              View Your Rides in Posted
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-8">
              Check the Posted tab to see and manage your posted rides
            </Text>
          </View>
        ) : activeTab === "requests" ? (
          myRequests.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="list-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                No ride requests
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center px-8">
                Request a ride from the home screen
              </Text>
            </View>
          ) : (
            myRequests.map(({ ride, request }) => (
              <PassengerRequestCard
                key={request.id}
                ride={ride}
                request={request}
                onCancel={cancelRequest}
              />
            ))
          )
        ) : myPostedRides.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="car-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No posted rides
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-8">
              Post a ride from the home screen to help students get to campus
            </Text>
          </View>
        ) : (
          myPostedRides.map((ride) => (
            <PostedRideCard
              key={ride.id}
              ride={ride}
              onCancelRide={cancelRide}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

interface PostedRideCardProps {
  ride: Ride;
  onCancelRide: (rideId: string) => void;
}

function PostedRideCard({ ride, onCancelRide }: PostedRideCardProps) {
  const pendingRequests = ride.requests.filter((r) => r.status === "pending");

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-200">
      {/* Active Status Badge */}
      <View className="self-start px-3 py-1 rounded-full mb-3 bg-green-100">
        <Text className="text-xs font-semibold uppercase text-green-700">
          Active
        </Text>
      </View>

      {/* Destination */}
      <View className="mb-3">
        <Text className="text-lg font-bold text-gray-900">{ride.destination}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {format(new Date(ride.departureTime), "MMM d, h:mm a")}
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row items-center justify-between py-3 border-t border-b border-gray-100 mb-3">
        <View className="items-center">
          <Text className="text-2xl font-bold text-primary">
            {ride.acceptedPassengers.length}
          </Text>
          <Text className="text-xs text-gray-600 mt-1">Accepted</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-yellow-600">
            {pendingRequests.length}
          </Text>
          <Text className="text-xs text-gray-600 mt-1">Pending</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-600">
            {ride.availableSeats}/{ride.totalSeats}
          </Text>
          <Text className="text-xs text-gray-600 mt-1">Seats</Text>
        </View>
      </View>

      {/* Notes */}
      {ride.notes && (
        <View className="mb-3 bg-gray-50 rounded-lg p-3">
          <Text className="text-xs text-gray-500 mb-1">Notes:</Text>
          <Text className="text-sm text-gray-700">{ride.notes}</Text>
        </View>
      )}

      {/* Cancel Button */}
      <Pressable
        onPress={() => onCancelRide(ride.id)}
        className="bg-red-50 border border-red-200 rounded-xl py-3 items-center"
      >
        <Text className="text-red-600 font-semibold">Cancel This Ride</Text>
      </Pressable>
    </View>
  );
}

interface DriverRideCardProps {
  ride: Ride;
  onAccept: (rideId: string, requestId: string) => void;
  onReject: (rideId: string, requestId: string) => void;
  onCancelRide: (rideId: string) => void;
}

function DriverRideCard({ ride, onAccept, onReject, onCancelRide }: DriverRideCardProps) {
  const pendingRequests = ride.requests.filter((r) => r.status === "pending");

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-200">
      {/* Destination */}
      <View className="mb-3">
        <Text className="text-lg font-bold text-gray-900">{ride.destination}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {format(new Date(ride.departureTime), "MMM d, h:mm a")}
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row items-center justify-between py-3 border-t border-b border-gray-100 mb-3">
        <View className="items-center">
          <Text className="text-2xl font-bold text-primary">
            {ride.acceptedPassengers.length}
          </Text>
          <Text className="text-xs text-gray-600 mt-1">Accepted</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-yellow-600">
            {pendingRequests.length}
          </Text>
          <Text className="text-xs text-gray-600 mt-1">Pending</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-600">
            {ride.availableSeats}
          </Text>
          <Text className="text-xs text-gray-600 mt-1">Available</Text>
        </View>
      </View>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <View className="mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Pending Requests:
          </Text>
          {pendingRequests.map((request) => (
            <View
              key={request.id}
              className="bg-gray-50 rounded-xl p-3 mb-2"
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {request.riderName}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    📍 {request.pickupLocation}
                  </Text>
                  <Text className="text-sm text-green-700 font-semibold mt-1">
                    ${request.calculatedPrice.toFixed(2)} • {request.distanceKm.toFixed(1)} km
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => onAccept(ride.id, request.id)}
                  className="flex-1 bg-green-600 rounded-lg py-2 items-center"
                >
                  <Text className="text-white font-semibold">Accept</Text>
                </Pressable>
                <Pressable
                  onPress={() => onReject(ride.id, request.id)}
                  className="flex-1 bg-red-600 rounded-lg py-2 items-center"
                >
                  <Text className="text-white font-semibold">Reject</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Accepted Passengers */}
      {ride.acceptedPassengers.length > 0 && (
        <View className="mb-3">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Accepted Passengers:
          </Text>
          {ride.acceptedPassengers.map((passenger) => (
            <View
              key={passenger.id}
              className="bg-green-50 rounded-xl p-3 mb-2 border border-green-200"
            >
              <Text className="font-semibold text-gray-900">
                {passenger.riderName}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                📍 {passenger.pickupLocation}
              </Text>
              <Text className="text-sm text-green-700 font-semibold mt-1">
                ${passenger.calculatedPrice.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Cancel Ride Button */}
      {ride.status === "active" && (
        <Pressable
          onPress={() => onCancelRide(ride.id)}
          className="bg-red-600 rounded-xl py-3 items-center mt-2"
        >
          <Text className="text-white font-semibold">Cancel This Ride</Text>
        </Pressable>
      )}

      {/* Cancelled Status */}
      {ride.status === "cancelled" && (
        <View className="bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
          <Text className="text-red-700 font-semibold text-center">
            This ride has been cancelled
          </Text>
        </View>
      )}
    </View>
  );
}

interface PassengerRequestCardProps {
  ride: Ride;
  request: any;
  onCancel: (rideId: string, requestId: string) => void;
}

function PassengerRequestCard({
  ride,
  request,
  onCancel,
}: PassengerRequestCardProps) {
  const navigation = useNavigation();
  const statusColor =
    request.status === "accepted"
      ? "green"
      : request.status === "pending"
      ? "yellow"
      : "red";

  const handleViewTracking = () => {
    (navigation as any).navigate("LiveTracking", {
      pickupLocation: request.pickupLocation,
      pickupCoordinates: request.pickupCoordinates,
      driverName: ride.driverName,
      destination: ride.destination,
      calculatedPrice: request.calculatedPrice,
      rideId: ride.id,
      requestId: request.id,
    });
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-200">
      {/* Status Badge */}
      <View
        className={`self-start px-3 py-1 rounded-full mb-3 ${
          statusColor === "green"
            ? "bg-green-100"
            : statusColor === "yellow"
            ? "bg-yellow-100"
            : "bg-red-100"
        }`}
      >
        <Text
          className={`text-xs font-semibold uppercase ${
            statusColor === "green"
              ? "text-green-700"
              : statusColor === "yellow"
              ? "text-yellow-700"
              : "text-red-700"
          }`}
        >
          {request.status}
        </Text>
      </View>

      {/* Ride Info */}
      <Text className="text-lg font-bold text-gray-900 mb-1">
        {ride.destination}
      </Text>
      <Text className="text-sm text-gray-600 mb-3">
        Driver: {ride.driverName} • {format(new Date(ride.departureTime), "MMM d, h:mm a")}
      </Text>

      {/* Pickup & Price */}
      <View className="bg-gray-50 rounded-xl p-3 mb-3">
        <Text className="text-sm text-gray-600">Your pickup:</Text>
        <Text className="text-base font-semibold text-gray-900 mt-1">
          {request.pickupLocation}
        </Text>
        <Text className="text-lg font-bold text-green-700 mt-2">
          ${request.calculatedPrice.toFixed(2)}
        </Text>
      </View>

      {/* Cancel Button */}
      {request.status === "pending" && (
        <Pressable
          onPress={() => onCancel(ride.id, request.id)}
          className="bg-red-50 border border-red-200 rounded-xl py-3 items-center"
        >
          <Text className="text-red-600 font-semibold">Cancel Request</Text>
        </Pressable>
      )}

      {/* View Tracking Button for Accepted MoCheddar67 Rides */}
      {request.status === "accepted" && ride.driverName === "MoCheddar67" && (
        <Pressable
          onPress={handleViewTracking}
          className="bg-primary rounded-xl py-3 items-center flex-row justify-center"
        >
          <Ionicons name="location" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Track Driver</Text>
        </Pressable>
      )}
    </View>
  );
}
