import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ride, User, RideRequest, PassengerRideRequest } from "../types/ride";

interface RideState {
  rides: Ride[];
  passengerRideRequests: PassengerRideRequest[];
  currentUser: User | null;
  addRide: (ride: Omit<Ride, "id" | "createdAt" | "requests" | "acceptedPassengers" | "status">) => void;
  requestRide: (rideId: string, request: Omit<RideRequest, "id" | "requestedAt" | "status">) => void;
  acceptRequest: (rideId: string, requestId: string) => void;
  rejectRequest: (rideId: string, requestId: string) => void;
  cancelRequest: (rideId: string, requestId: string) => void;
  cancelRide: (rideId: string) => void;
  addPassengerRideRequest: (request: Omit<PassengerRideRequest, "id" | "createdAt" | "status" | "offerCount">) => void;
  cancelPassengerRideRequest: (requestId: string) => void;
  getMyPassengerRideRequests: () => PassengerRideRequest[];
  getActivePassengerRideRequests: () => PassengerRideRequest[];
  setCurrentUser: (user: User) => void;
  getAvailableRides: () => Ride[];
  getMyRides: () => Ride[];
  getMyRequests: () => { ride: Ride; request: RideRequest }[];
  initializeMockData: () => void;
}

// Mock data for initial rides - drivers posting rides to campus locations
const getMockRides = (): Ride[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const afternoon = new Date();
  afternoon.setHours(15, 30, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);
  nextWeek.setHours(7, 45, 0, 0);

  return [
    {
      id: "mock1",
      driverName: "MoCheddar67",
      driverId: "driver1",
      destination: "Western University - North Campus",
      destinationCoordinates: { latitude: 43.0096, longitude: -81.2737 },
      departureTime: tomorrow,
      availableSeats: 3,
      totalSeats: 3,
      notes: "Leaving right at 8am, please be on time!",
      requests: [],
      acceptedPassengers: [],
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "mock2",
      driverName: "Mike Chen",
      driverId: "driver2",
      destination: "Western University - University College",
      destinationCoordinates: { latitude: 43.0089, longitude: -81.2739 },
      departureTime: afternoon,
      availableSeats: 4,
      totalSeats: 4,
      notes: "Going to UC for afternoon class",
      requests: [],
      acceptedPassengers: [],
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "mock3",
      driverName: "Emily Rodriguez",
      driverId: "driver3",
      destination: "Western University - Ivey Business School",
      destinationCoordinates: { latitude: 43.0074, longitude: -81.2744 },
      departureTime: nextWeek,
      availableSeats: 2,
      totalSeats: 2,
      requests: [],
      acceptedPassengers: [],
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "mock4",
      driverName: "Alex Thompson",
      driverId: "driver4",
      destination: "Western University - Weldon Library",
      destinationCoordinates: { latitude: 43.0098, longitude: -81.2752 },
      departureTime: tomorrow,
      availableSeats: 4,
      totalSeats: 4,
      notes: "Study session at the library. Happy to pick up anyone!",
      requests: [],
      acceptedPassengers: [],
      status: "active",
      createdAt: new Date(),
    },
  ];
};

export const useRideStore = create<RideState>()(
  persist(
    (set, get) => ({
      rides: [],
      passengerRideRequests: [],
      currentUser: null,

      addRide: (ride) => {
        const newRide: Ride = {
          ...ride,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          requests: [],
          acceptedPassengers: [],
          status: "active",
        };
        set((state) => ({ rides: [newRide, ...state.rides] }));
      },

      requestRide: (rideId, requestData) => {
        const newRequest: RideRequest = {
          ...requestData,
          id: Math.random().toString(36).substr(2, 9),
          requestedAt: new Date(),
          status: "pending",
        };

        set((state) => {
          const ride = state.rides.find((r) => r.id === rideId);

          // Special case for MoCheddar67 - auto-accept
          if (ride?.driverName === "MoCheddar67") {
            const acceptedRequest = { ...newRequest, status: "accepted" as const };
            const remainingSeats = ride.totalSeats - ride.acceptedPassengers.length - 1;

            return {
              rides: state.rides.map((r) =>
                r.id === rideId
                  ? {
                      ...r,
                      requests: [...r.requests, acceptedRequest],
                      acceptedPassengers: [...r.acceptedPassengers, acceptedRequest],
                      availableSeats: Math.max(0, remainingSeats),
                    }
                  : r
              ),
            };
          }

          // Normal flow for other drivers
          return {
            rides: state.rides.map((r) =>
              r.id === rideId
                ? { ...r, requests: [...r.requests, newRequest] }
                : r
            ),
          };
        });

        // Return the request ID for navigation purposes
        return newRequest.id;
      },

      acceptRequest: (rideId, requestId) => {
        set((state) => ({
          rides: state.rides.map((ride) => {
            if (ride.id !== rideId) return ride;

            const request = ride.requests.find((r) => r.id === requestId);
            if (!request) return ride;

            const updatedRequest = { ...request, status: "accepted" as const };
            const remainingSeats = ride.totalSeats - ride.acceptedPassengers.length - 1;

            return {
              ...ride,
              requests: ride.requests.map((r) =>
                r.id === requestId ? updatedRequest : r
              ),
              acceptedPassengers: [...ride.acceptedPassengers, updatedRequest],
              availableSeats: Math.max(0, remainingSeats),
            };
          }),
        }));
      },

      rejectRequest: (rideId, requestId) => {
        set((state) => ({
          rides: state.rides.map((ride) =>
            ride.id === rideId
              ? {
                  ...ride,
                  requests: ride.requests.map((r) =>
                    r.id === requestId ? { ...r, status: "rejected" as const } : r
                  ),
                }
              : ride
          ),
        }));
      },

      cancelRequest: (rideId, requestId) => {
        set((state) => {
          const ride = state.rides.find((r) => r.id === rideId);
          if (!ride) return state;

          // Check if this request was accepted (exists in acceptedPassengers)
          const wasAccepted = ride.acceptedPassengers.some((p) => p.id === requestId);

          return {
            rides: state.rides.map((r) => {
              if (r.id !== rideId) return r;

              // Remove from both requests and acceptedPassengers arrays
              const updatedRequests = r.requests.filter((req) => req.id !== requestId);
              const updatedAcceptedPassengers = r.acceptedPassengers.filter((p) => p.id !== requestId);

              // Restore the seat if it was accepted
              const availableSeats = wasAccepted
                ? Math.min(r.availableSeats + 1, r.totalSeats)
                : r.availableSeats;

              return {
                ...r,
                requests: updatedRequests,
                acceptedPassengers: updatedAcceptedPassengers,
                availableSeats,
              };
            }),
          };
        });
      },

      cancelRide: (rideId) => {
        set((state) => ({
          rides: state.rides.map((ride) =>
            ride.id === rideId
              ? { ...ride, status: "cancelled" as const }
              : ride
          ),
        }));
      },

      setCurrentUser: (user) => set({ currentUser: user }),

      getAvailableRides: () => {
        const state = get();
        return state.rides.filter(
          (ride) =>
            ride.status === "active" &&
            ride.availableSeats > 0 &&
            ride.driverId !== state.currentUser?.id
        );
      },

      getMyRides: () => {
        const state = get();
        return state.rides.filter((ride) => ride.driverId === state.currentUser?.id);
      },

      getMyRequests: () => {
        const state = get();
        const requestsMap = new Map<string, { ride: Ride; request: RideRequest }>();

        state.rides.forEach((ride) => {
          // Get accepted passengers first (they take priority)
          ride.acceptedPassengers.forEach((request) => {
            if (request.riderId === state.currentUser?.id) {
              requestsMap.set(request.id, { ride, request });
            }
          });
          // Then get other requests (pending/rejected)
          ride.requests.forEach((request) => {
            if (request.riderId === state.currentUser?.id && !requestsMap.has(request.id)) {
              requestsMap.set(request.id, { ride, request });
            }
          });
        });

        return Array.from(requestsMap.values());
      },

      addPassengerRideRequest: (request) => {
        const newRequest: PassengerRideRequest = {
          ...request,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          status: "active",
          offerCount: 0,
        };
        set((state) => ({
          passengerRideRequests: [newRequest, ...state.passengerRideRequests]
        }));
      },

      cancelPassengerRideRequest: (requestId) => {
        set((state) => ({
          passengerRideRequests: state.passengerRideRequests.map((request) =>
            request.id === requestId
              ? { ...request, status: "cancelled" as const }
              : request
          ),
        }));
      },

      getMyPassengerRideRequests: () => {
        const state = get();
        return state.passengerRideRequests.filter(
          (request) => request.passengerId === state.currentUser?.id
        );
      },

      getActivePassengerRideRequests: () => {
        const state = get();
        return state.passengerRideRequests.filter(
          (request) => request.status === "active" && request.passengerId !== state.currentUser?.id
        );
      },

      initializeMockData: () => {
        const state = get();

        // Set current user if no user exists
        if (!state.currentUser) {
          set({
            currentUser: {
              id: "currentUser123",
              name: "Demo User",
              email: "demo@western.ca",
              school: "Western University",
              phone: "519-123-4567",
              ridesOffered: 0,
              ridesTaken: 0,
            },
          });
        }

        // Initialize rides - just the mock rides from other drivers
        if (state.rides.length === 0) {
          const mockRides = getMockRides();
          set({ rides: mockRides });
        }
      },
    }),
    {
      name: "ride-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 8, // Added passenger ride requests
      migrate: (persistedState: any, version: number) => {
        // If upgrading from old version, clear everything to get fresh data
        if (version < 8) {
          return {
            rides: [],
            passengerRideRequests: [],
            currentUser: null,
          };
        }
        return persistedState as RideState;
      },
    }
  )
);
