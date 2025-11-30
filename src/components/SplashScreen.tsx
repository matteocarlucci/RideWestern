import { View, Image } from "react-native";
import { useEffect } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <Image
        source={require("../../assets/RideWesternLogo-1764283044512.png")}
        style={{ width: 250, height: 100 }}
        resizeMode="contain"
      />
    </View>
  );
}
