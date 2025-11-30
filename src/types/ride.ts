export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RideRequest {
  id: string;
  riderId: string;
  riderName: string;
  pickupLocation: string;
  pickupCoordinates: Coordinate;
  requestedAt: Date;
  status: "pending" | "accepted" | "rejected";
  calculatedPrice: number;
  distanceKm: number;
}

export interface Ride {
  id: string;
  driverName: string;
  driverId: string;
  driverAvatar?: string;
  destination: string;
  destinationCoordinates?: Coordinate;
  departureTime: Date;
  availableSeats: number;
  totalSeats: number;
  notes?: string;
  requests: RideRequest[];
  acceptedPassengers: RideRequest[];
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
}

export interface PassengerRideRequest {
  id: string;
  passengerId: string;
  passengerName: string;
  pickupLocation: string;
  pickupCoordinates: Coordinate;
  destination: string;
  destinationCoordinates: Coordinate;
  departureTime: Date;
  seats: number;
  notes?: string;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  offerCount: number; // Number of drivers who have offered to take this request
}

export interface DriverOffer {
  id: string;
  driverId: string;
  driverName: string;
  price: number;
  status: "pending" | "accepted" | "rejected";
  offeredAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  school: string;
  avatar?: string;
  ridesOffered: number;
  ridesTaken: number;
  rating?: number;
}
