import PlaceForm from "../components/Places/PlaceForm"; // Import the PlaceForm component for adding new places
import { insertPlace } from "../util/database"; // Utility function to insert a new place into the database

function PlaceAdd({ navigation }) {
  // Handler for creating a new place
  async function createPlaceHandler(place) {
    // Insert the place into the database
    const result = await insertPlace(
      place.title,
      place.imageUri,
      place.address,
      place.location
    );
    // Navigate back to the "AllPlaces" screen after the place is added
    navigation.navigate("AllPlaces");
  }

  // Render the PlaceForm component, passing the createPlaceHandler as a prop
  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default PlaceAdd; // Export the component for use in navigation
