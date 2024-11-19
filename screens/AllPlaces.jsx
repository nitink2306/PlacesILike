import { useEffect, useState, useCallback } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PlacesList from "../components/Places/PlacesList";
import { useIsFocused } from "@react-navigation/native";
import { fetchPlaces } from "../util/database";
import { Colors } from "../constants/colors";

const AllPlaces = ({ route }) => {
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const isFocused = useIsFocused();

  // Load places when the screen is focused
  const loadPlaces = useCallback(async () => {
    const fetchedPlaces = await fetchPlaces();
    setPlaces(fetchedPlaces);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused, loadPlaces]);

  // Debounce the search query to improve performance
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query]);

  // Filter places based on the search query
  const filteredPlaces = places.filter((place) => {
    const lowerCaseQuery = debouncedQuery.toLowerCase();
    return (
      place.title.toLowerCase().includes(lowerCaseQuery) ||
      place.address?.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // Determine whether the current list is filtered
  const isFiltered = query.length > 0;

  return (
    <View style={styles.container}>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onClear={() => setQuery("")}
      />
      <PlacesList places={filteredPlaces} isFiltered={isFiltered} />
    </View>
  );
};

// Search bar component for better separation of concerns
const SearchBar = ({ query, onQueryChange, onClear }) => (
  <View style={styles.searchBarContainer}>
    <TextInput
      style={styles.searchBar}
      placeholder="Search by title or address"
      placeholderTextColor="#D3D3D3"
      value={query}
      onChangeText={onQueryChange}
    />
    {query.length > 0 && (
      <TouchableOpacity onPress={onClear} style={styles.clearButton}>
        <Ionicons name="close-circle" size={22} color={Colors.primary500} />
      </TouchableOpacity>
    )}
  </View>
);

export default AllPlaces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.gray700,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.primary500,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: Colors.primary100,
  },
  searchBar: {
    flex: 1,
    height: 42,
    color: "#FFFFFF",
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 10,
  },
});
