import { useEffect, useState } from "react";
import { Alert, View, StyleSheet, Image, Text } from "react-native";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

import { Colors } from "../../constants/colors";
import CustomButton from "../UI/CustomButtom";
import { getAddress, getMapPreview } from "../../util/location";

function LocationPicker({ onPickLocation, initialLocation, origin, placeId }) {
  const [pickedLocation, setPickedLocation] = useState(initialLocation || null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  // Set the initial location once
  useEffect(() => {
    if (initialLocation && !pickedLocation) {
      setPickedLocation(initialLocation);
    }
  }, [initialLocation, pickedLocation]);

  // Update pickedLocation if returning from Map with coordinates
  useEffect(() => {
    if (isFocused && route.params?.pickedLat && route.params?.pickedLng) {
      setPickedLocation({
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      });
    }
  }, [route.params, isFocused]);

  // Fetch the address when pickedLocation changes
  useEffect(() => {
    async function fetchAddress() {
      if (pickedLocation?.lat && pickedLocation?.lng) {
        try {
          const address = await getAddress(
            pickedLocation.lat,
            pickedLocation.lng
          );
          onPickLocation({ ...pickedLocation, address });
        } catch (error) {
          console.error("Error fetching address:", error.message);
          Alert.alert("Error", "Failed to fetch address.");
        }
      }
    }
    fetchAddress();
  }, [pickedLocation, onPickLocation]);

  // Verify and request location permissions
  const verifyPermissions = async () => {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app."
      );
      return false;
    }
    return true;
  };

  // Get the user's current location
  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  // Navigate to the Map screen
  const pickOnMapHandler = () => {
    navigation.navigate("Map", {
      origin: origin || "PlaceAdd",
      placeId,
    });
  };

  // Render map preview or placeholder
  const renderLocationPreview = () =>
    pickedLocation ? (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    ) : (
      <Text style={styles.noLocationText}>No location picked yet.</Text>
    );

  return (
    <View>
      <View style={styles.mapPreview}>{renderLocationPreview()}</View>
      <View style={styles.actions}>
        <CustomButton icon="location" onPress={getLocationHandler}>
          Locate User
        </CustomButton>
        <CustomButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </CustomButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noLocationText: {
    color: Colors.primary500,
    fontSize: 16,
    fontStyle: "italic",
  },
});
