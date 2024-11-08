import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { fetchPlaces } from "../util/database"; // Function to fetch locations from database
import { Colors } from "../constants/colors";

function AllLocationsMap() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      try {
        const formatted_places = await fetchPlaces(); // Retrieve formatted_places array
        console.log(formatted_places);
        const extractedLocations = formatted_places.map((place) => ({
          latitude: place.location.latitude,
          longitude: place.location.longitude,
        }));
        console.log(extractedLocations);
        setLocations(extractedLocations); // Set only lat and lng
      } catch (error) {
        console.error("Failed to load locations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  // Define initial region based on the first location in the list
  const initialRegion =
    locations.length > 0
      ? {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
          latitudeDelta: 0.05, // Adjust zoom level as needed
          longitudeDelta: 0.05, // Adjust zoom level as needed
        }
      : {
          // Default region if no locations are available
          latitude: 37.78825, // Example latitude (e.g., central point)
          longitude: -122.4324, // Example longitude
          latitudeDelta: 1, // Higher delta for a wider view
          longitudeDelta: 1,
        };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    );
  }

  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      {locations.map((location, index) => (
        <Marker
          key={index} // Use index as the key since we have no unique id
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        />
      ))}
    </MapView>
  );
}

export default AllLocationsMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
