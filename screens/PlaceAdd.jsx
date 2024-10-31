import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";

function PlaceAdd({ navigation }) {
  async function createPlaceHandler(place) {
    const result = await insertPlace(
      place.title,
      place.imageUri,
      place.address,
      place.location
    );
    navigation.navigate("AllPlaces");
  }
  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default PlaceAdd;
