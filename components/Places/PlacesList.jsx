import { FlatList } from "react-native";
import PlaceItem from "./PlaceItem";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

function PlacesList({ places, isFiltered }) {
  const navigation = useNavigation(); // Hook to enable navigation between screens

  // Navigate to the "PlaceDetailed" screen with the selected place ID
  function selectPlaceHandler(id) {
    navigation.navigate("PlaceDetailed", {
      placeId: id,
    });
  }

  // Determine fallback UI based on the state of the list
  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallBackText}>
          {isFiltered ? "No matching places found" : "No places added"}
        </Text>
      </View>
    );
  }

  // Render the list of places
  return (
    <FlatList
      style={styles.list}
      data={places} // Data array for FlatList
      keyExtractor={(item) => item.id} // Use unique place ID as the key
      renderItem={({ item }) => (
        <PlaceItem place={item} onSelect={selectPlaceHandler} />
      )} // Render each place as a PlaceItem component
      showsVerticalScrollIndicator={false} // Hide the vertical scrollbar
    />
  );
}

export default PlacesList;

const styles = StyleSheet.create({
  list: {
    margin: 24, // Outer margin for the list
  },
  fallbackContainer: {
    flex: 1, // Fill available space
    justifyContent: "center", // Center fallback content vertically
    alignItems: "center", // Center fallback content horizontally
  },
  fallBackText: {
    fontSize: 16, // Text size for fallback message
    color: Colors.primary200, // Theme color for fallback text
  },
});
