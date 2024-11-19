import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import PlaceForm from "../components/Places/PlaceForm"; // Reusable form component for adding/editing places
import { fetchPlaceWithId, updatePlace } from "../util/database"; // Database utility functions
import { Colors } from "../constants/colors";

export default function EditPlace({ route, navigation }) {
  // State to store the data of the place being edited
  const [placeData, setPlaceData] = useState({});
  // State to manage the loading spinner while fetching data
  const [loading, setLoading] = useState(true);

  // Get the `placeId` from the navigation route params
  const placeId = route.params.placeId;

  // Fetch the data for the place when the component mounts
  useEffect(() => {
    async function loadPlaceData() {
      setLoading(true); // Show loading spinner
      const data = await fetchPlaceWithId(placeId); // Fetch place data by ID

      // Format the fetched data to match the structure used by the `PlaceForm` component
      const formattedData = {
        title: data.title,
        imageUri: data.imageUri,
        location: {
          lat: data.lat,
          lng: data.lng,
        },
        id: data.id,
      };

      setPlaceData(formattedData); // Update the state with the formatted data
      setLoading(false); // Hide loading spinner
    }

    loadPlaceData();
  }, [placeId]); // Re-run the effect whenever `placeId` changes

  // Handle form submission
  async function handleFormSubmit(updatedPlace) {
    console.log(updatedPlace); // Debug log for the updated place data

    // Reformat the data for saving to the database
    const formattedData = {
      title: updatedPlace.title,
      imageUri: updatedPlace.imageUri,
      address: updatedPlace.address,
      lat: updatedPlace.location.latitude,
      lng: updatedPlace.location.longitude,
      id: updatedPlace.id,
    };

    // Update the place in the database
    await updatePlace(formattedData);

    // Navigate back to the detailed view of the edited place
    navigation.navigate("PlaceDetailed", { placeId });
  }

  // Show a loading spinner while the place data is being fetched
  if (!placeData) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    );
  }

  // Show a loading spinner if the loading state is true
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    );
  }

  // Render the `PlaceForm` component with initial values and submit handler
  return (
    <PlaceForm
      initialValues={placeData} // Pass the fetched place data as initial values
      onEditPlace={handleFormSubmit} // Function to handle form submission
      origin="EditPlace" // Indicate the origin to help with navigation flow
      placeId={placeId} // Pass the place ID to the form for reference
    />
  );
}

const styles = StyleSheet.create({
  // Centered loading spinner styling
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
