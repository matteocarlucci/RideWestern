import { Coordinate } from "../types/ride";

// Western University coordinates (London, Ontario)
const WESTERN_UNIVERSITY: Coordinate = {
  latitude: 43.0096,
  longitude: -81.2737,
};

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  coord1: Coordinate,
  coord2: Coordinate
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calculate ride price based on distance from Western University
// $2/km with a minimum of $4
export function calculateRidePrice(pickupCoordinates: Coordinate): {
  price: number;
  distance: number;
} {
  const distance = calculateDistance(WESTERN_UNIVERSITY, pickupCoordinates);
  const calculatedPrice = distance * 2;
  const finalPrice = Math.max(4, Math.round(calculatedPrice * 100) / 100);

  return {
    price: finalPrice,
    distance: Math.round(distance * 100) / 100,
  };
}

export { WESTERN_UNIVERSITY };
