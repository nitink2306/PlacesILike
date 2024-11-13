import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

import IconButton from "../components/UI/IconButton";

function Map({ navigation, route }) {
  const initialLocation =
    route.params?.initialLat && route.params?.initialLng
      ? {
          lat: route.params.initialLat,
          lng: route.params.initialLng,
        }
      : null;

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const origin = route.params?.origin;

  const placeId = route.params?.placeId;

  const region = {
    latitude: initialLocation ? initialLocation.lat : 39.1716,
    longitude: initialLocation ? initialLocation.lng : -86.5167,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event) {
    if (initialLocation) {
      return;
    }
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

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
      placeId: placeId,
    });
  }, [navigation, selectedLocation, origin]);

  useLayoutEffect(() => {
    if (initialLocation) {
      return;
    }
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
