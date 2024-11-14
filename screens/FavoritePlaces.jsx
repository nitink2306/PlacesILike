import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlacesList from "../components/Places/PlacesList";
import { fetchPlaces } from "../util/database";
import { Colors } from "../constants/colors";

export default function FavoritePlaces({ navigation }) {
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFavoritePlaces() {
      try {
        setIsLoading(true);
        // Get favorite place IDs from AsyncStorage
        const favorites = await AsyncStorage.getItem("favoritePlaces");
        const favoriteIds = favorites ? JSON.parse(favorites) : [];

        // Fetch all places from the database
        const allPlaces = await fetchPlaces();

        // Filter only the favorite places
        const filteredPlaces = allPlaces.filter((place) =>
          favoriteIds.includes(place.id)
        );

        setFavoritePlaces(filteredPlaces);
      } catch (error) {
        console.error("Failed to load favorite places:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Load favorite places when the screen is focused
    const unsubscribe = navigation.addListener("focus", loadFavoritePlaces);
    return unsubscribe;
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading favorite places...</Text>
      </View>
    );
  }

  if (favoritePlaces.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have no favorite places yet!</Text>
      </View>
    );
  }

  return <PlacesList places={favoritePlaces} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray700,
  },
});
