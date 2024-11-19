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
  const [debouncedQuery, setDebouncedQuery] = useState("");
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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
          placeholderTextColor="#D3D3D3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={22} color={Colors.primary500} />
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
