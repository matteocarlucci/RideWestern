# Ride Western - Student RideShare App

A modern, intuitive mobile app for Western University students in London, Ontario to share rides to campus. Built with React Native and Expo.

## Features

### 🏠 Home Screen - Find Rides
**Browse available rides from drivers heading to campus:**

- Search by destination or driver name
- Filter rides by campus destination
- View detailed ride information including:
  - Driver details with ratings
  - Campus destination
  - Departure time
  - Available seats
  - Additional notes from driver
- Request rides by setting your pickup location on an interactive map
- Dynamic pricing: $2/km from Western University (minimum $4)
- Floating action button to quickly post a new ride as a driver

### 🗺️ Map Screen - Visual Navigation
- Interactive map centered on London, Ontario
- View all active rides with destination markers on campus
- Purple markers for campus destinations
- Green markers for accepted passenger pickup locations
- Tap any marker to see ride details
- Bottom sheet card with full ride information
- Legend to identify marker types
- Your location displayed on the map
- Real-time route visualization

### 🚗 My Rides Screen
**Three tabs for complete ride management:**

**1. My Rides:**
- Info tab directing you to the Posted tab to manage your rides as a driver

**2. Join Requests (as passenger):**
- View all your ride requests on driver-posted rides (pending, accepted, or rejected)
- See pickup location and calculated price for each request
- Cancel requests anytime - for accepted rides (including MoCheddar67), cancellation fully removes the request and restores the seat availability
- Cancelled rides immediately become available to request again
- Track ride status
- **For accepted MoCheddar67 rides**: Tap "Track Driver" to see live tracking

**3. Posted:**
- View all active rides you've posted as a driver
- Monitor pending requests, accepted passengers, and available seats at a glance
- See destination, departure time, and your notes
- Cancel your posted ride - it will disappear from the list immediately
- Clean, focused view showing only your active rides

### 👤 Profile Screen
- Create and edit your profile
- Set up your information:
  - Full name
  - School name
  - Phone number
- View your ride statistics:
  - Total rides offered as driver
  - Total rides taken as passenger
- Access settings for notifications, privacy, and support

### ✨ Post a Ride
Beautiful modal interface for posting new rides as a driver:
- Set campus destination
- Choose departure date and time
- Select number of available seats (1-5)
- Add optional notes for passengers
- Native date/time picker for iOS
- Automatic coordinate assignment to Western University
- Students will request with their pickup locations
- Prices calculated automatically based on distance

### 📍 Request a Ride (from Driver's Post)
Interactive map-based pickup location selection when requesting an existing driver's ride:
- Full-screen modal with tap-to-pin functionality
- Tap anywhere on the map to set your exact pickup location
- Real-time price calculation display based on distance
- Optional location name field (e.g., "My Apartment", "Coffee Shop")
- Coordinate display for precision
- Clear visual marker at selected location

## Design Highlights

- **Modern iOS-first Design**: Clean, polished interface following Apple's Human Interface Guidelines
- **Western University Branding**: Professional purple color scheme (#4A4063) with Ride Western logo splash screen
- **Splash Screen**: 5-second branded splash screen with centered logo on app launch
- **Simplified Browse Experience**: Single view to browse all available driver rides
- **Intuitive Navigation**: Bottom tab navigation with clean purple headers
- **Smart Filtering**: Quick filter chips for destinations and real-time search
- **Empty States**: Helpful empty states with icons and guidance
- **Visual Location Selection**: Interactive map for precise pickup location pinning
- **Status Badges**: Clear visual indicators for request status (pending, accepted, rejected, cancelled)
- **Dynamic Pricing Display**: Real-time price calculation as you select pickup location
- **Full Cancellation Support**: Cancel accepted rides and immediately request them again
- **Three-Tab Management**: Complete view of your rides as driver, passenger requests, and your posted requests

## Technical Stack

- **Framework**: React Native 0.76.7 with Expo SDK 53
- **Navigation**: React Navigation v7 (Bottom Tabs & Native Stack)
- **State Management**: Zustand with AsyncStorage persistence and version migration
- **Maps**: react-native-maps for interactive map functionality
- **Styling**: NativeWind (Tailwind CSS for React Native) with custom purple theme
- **Icons**: Ionicons from @expo/vector-icons
- **Date Handling**: date-fns for formatting
- **Type Safety**: Full TypeScript implementation
- **Geolocation**: Haversine formula for distance calculations

## Data Structure

### Ride Model (Driver-Posted Rides)
- Driver information (ID, name)
- Campus destination with coordinates
- Departure time
- Seat availability (available/total)
- Optional notes
- Array of ride requests (pending and rejected)
- Array of accepted passengers with pickup details
- Status (active/completed/cancelled)

### PassengerRideRequest Model (Passenger-Posted Requests)
- Passenger information (ID, name)
- Pickup location name and coordinates
- Destination with coordinates
- Departure time
- Number of seats needed
- Optional notes about preferences
- Status (active/completed/cancelled)
- Offer count (number of drivers who offered rides)
- Created timestamp

### RideRequest Model (Request to Join Driver's Ride)
- Rider information (ID, name)
- Pickup location name
- Pickup coordinates (latitude, longitude)
- Request status (pending/accepted/rejected)
- Calculated price based on distance
- Distance in kilometers from Western University
- Request timestamp

### User Model
- Personal information (name, email, phone)
- School affiliation
- Ride statistics (offered/taken)

## State Management

All ride and user data is managed through Zustand with AsyncStorage persistence:
- Version migration system to handle data structure changes
- Both driver rides and passenger requests are stored locally and persist between sessions
- Mock data is automatically loaded on first launch
- Real-time updates when requesting/accepting/rejecting rides
- Real-time updates when posting/cancelling passenger ride requests
- Efficient selectors to prevent unnecessary re-renders
- Request/Accept pattern for driver rides
- Post/Offer pattern for passenger requests

## Pricing System

Dynamic pricing based on geographic distance:
- Base rate: $2.00 per kilometer
- Calculated from pickup location to Western University coordinates (43.0096, -81.2737)
- Minimum price: $4.00
- Uses Haversine formula for accurate distance calculation
- Real-time price display during pickup location selection

## Getting Started

The app comes pre-loaded with demo rides from other drivers:

1. **Your Profile**: You start as "Demo User" with a clean slate

2. **Browse Available Rides**:
   - Explore available rides from drivers (MoCheddar67, Mike Chen, Emily Rodriguez, Alex Thompson)
   - Use search and filters to find rides to your destination

3. **Request a Driver's Ride**:
   - Tap "Request Ride" on any available ride
   - Pin your pickup location on the map
   - Enter a location name to help the driver find you
   - Click "Send"
   - **Special: MoCheddar67 rides are instantly accepted** - you'll immediately see the live tracking screen with their location at McDonald's on Oxford & Wharncliffe and a 5-minute ETA
   - **Other drivers**: Your request will appear as "pending" in the "Join Requests" tab, waiting for driver approval

4. **Cancel and Re-request**:
   - Go to "Join Requests" tab to see your ride requests
   - Tap "Cancel Request" to fully remove your request
   - The ride immediately becomes available again in Find Rides
   - You can request the same ride again as if you never made a request

5. **Post Your Own Ride as Driver**:
   - Tap the purple car button on the Find Rides screen to offer a ride to campus
   - Your posted ride will appear in the "Posted" tab

6. **Manage Your Posted Rides**:
   - View all your posted rides in the "Posted" tab
   - See pending requests, accepted passengers, and available seats
   - Cancel your ride anytime if needed

## Demo Features

**MoCheddar67 Instant Acceptance**: For demonstration purposes, rides with driver "MoCheddar67" bypass the manual acceptance flow. When you request this ride:
- Request is automatically accepted
- Immediately shows live tracking screen
- Displays driver location at McDonald's (Oxford & Wharncliffe)
- Shows 5-minute estimated arrival time
- Can be accessed anytime from "My Requests" by tapping "Track Driver"

All other drivers follow the normal request/accept workflow.

## Future Enhancements

Potential features for future development:
- Real-time location tracking during rides
- In-app messaging between drivers and passengers
- Payment integration (Stripe, PayPal)
- Driver and vehicle verification
- Push notifications for ride request status changes
- Rating and review system for drivers and passengers
- Optimized route display with turn-by-turn navigation
- Recurring ride schedules for regular commuters
- Campus event integration
- Student ID verification

## App Structure

```
src/
├── components/
│   ├── RideCard.tsx           # Displays individual ride with join button
│   └── PostRideModal.tsx      # Modal for posting new rides
├── screens/
│   ├── HomeScreen.tsx         # Browse and search available rides
│   ├── RidesScreen.tsx        # View your rides (driver/passenger)
│   └── ProfileScreen.tsx      # User profile and settings
├── navigation/
│   └── RootNavigator.tsx      # Bottom tab navigation setup
├── state/
│   └── rideStore.ts           # Zustand store for rides and users
└── types/
    └── ride.ts                # TypeScript interfaces for Ride and User
```

## Notes

- The app uses local storage only (no backend required)
- Mock data includes 4 sample rides with various schools and times
- All dates and times use native date/time pickers
- Safe area handling ensures proper display on all iOS devices
- Keyboard dismissal is handled automatically for better UX
