import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../components/UI/IconButton";

function Map({ navigation, route }) {
  // Extract route parameters
  const { initialLat, initialLng, origin, placeId } = route.params || {};

  // Determine the initial location, if provided
  const initialLocation =
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null;

  // State to track the selected location
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  // Define the map's region, defaulting to a central location if no initialLocation is provided
  const region = {
    latitude: initialLocation?.lat || 39.1716,
    longitude: initialLocation?.lng || -86.5167,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Handle selecting a new location on the map
  const selectLocationHandler = (event) => {
    // Prevent selection if an initial location is already set
    if (initialLocation) return;

    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ lat: latitude, lng: longitude });
  };

  // Save the picked location and navigate back to the originating screen
  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        "No location picked!",
        "You have to pick a location (by tapping on the map) first!"
      );
      return;
    }

    navigation.navigate(origin, {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
      placeId, // Pass placeId back if provided
    });
  }, [navigation, selectedLocation, origin, placeId]);

  // Dynamically set the "Save" button in the header if no initial location exists
  useLayoutEffect(() => {
    if (initialLocation) return;

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, initialLocation]);

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
}

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
