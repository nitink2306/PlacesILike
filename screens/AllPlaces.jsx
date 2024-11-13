import { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PlacesList from "../components/Places/PlacesList";
import { useIsFocused } from "@react-navigation/native";
import { fetchPlaces } from "../util/database";
import { Colors } from "../constants/colors";

function AllPlaces({ route }) {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced search query
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      setLoadedPlaces(places);
    }
    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    // Cleanup the timeout if searchQuery changes
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Filter places based on the debounced query
  const filteredPlaces = loadedPlaces.filter((place) => {
    const titleMatch = place.title
      .toLowerCase()
      .includes(debouncedQuery.toLowerCase());
    const addressMatch = place.address
      ?.toLowerCase()
      .includes(debouncedQuery.toLowerCase());
    return titleMatch || addressMatch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by title or address"
          placeholderTextColor="#FFFFFF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={Colors.gray700} />
          </TouchableOpacity>
        ) : null}
      </View>
      <PlacesList places={filteredPlaces} />
    </View>
  );
}

export default AllPlaces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.gray700, // Dark background
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.primary500,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: Colors.primary100, // Darker input background
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: "#FFFFFF", // Light text color for dark theme
  },
  clearButton: {
    marginLeft: 5,
  },
});
