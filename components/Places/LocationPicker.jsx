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
import OutlinedButton from "../UI/CustomButtom";
import { getAddress, getMapPreview } from "../../util/location";

function LocationPicker({ onPickLocation, initialLocation, origin, placeId }) {
  const [pickedLocation, setPickedLocation] = useState(initialLocation || null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  // Set initial location only once if it's defined
  useEffect(() => {
    if (initialLocation && !pickedLocation) {
      setPickedLocation(initialLocation);
    }
  }, [initialLocation]);

  // Update picked location if returning from the Map screen with selected coordinates
  useEffect(() => {
    if (
      isFocused &&
      route.params &&
      route.params.pickedLat &&
      route.params.pickedLng
    ) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  // Fetch address only when pickedLocation changes
  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation && pickedLocation.lat && pickedLocation.lng) {
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

    handleLocation();
  }, [pickedLocation, onPickLocation]);

  async function verifyPermissions() {
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
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {
    navigation.navigate("Map", {
      origin: origin || "PlaceAdd",
      placeId: placeId,
    });
  }

  // Show map preview if there is a valid picked location
  let locationPreview = <Text>No location picked yet.</Text>;
  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
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
});
