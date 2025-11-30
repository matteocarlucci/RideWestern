declare module "react-native-maps" {
  import { Component } from "react";
  import { ViewProps } from "react-native";

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface LatLng {
    latitude: number;
    longitude: number;
  }

  export interface MapViewProps extends ViewProps {
    provider?: "google" | null;
    initialRegion?: Region;
    region?: Region;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    onRegionChange?: (region: Region) => void;
    onRegionChangeComplete?: (region: Region) => void;
    children?: React.ReactNode;
  }

  export interface MarkerProps {
    coordinate: LatLng;
    title?: string;
    description?: string;
    onPress?: () => void;
    pinColor?: string;
    children?: React.ReactNode;
  }

  export interface PolylineProps {
    coordinates: LatLng[];
    strokeColor?: string;
    strokeWidth?: number;
    lineDashPattern?: number[];
  }

  export default class MapView extends Component<MapViewProps> {}
  export class Marker extends Component<MarkerProps> {}
  export class Polyline extends Component<PolylineProps> {}
  export const PROVIDER_DEFAULT: null;
  export const PROVIDER_GOOGLE: "google";
}
