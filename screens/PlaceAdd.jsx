import PlaceForm from "../components/Places/PlaceForm";

function PlaceAdd({ navigation }) {
  function createPlaceHandler(place) {
    navigation.navigate("AllPlaces", {
      place: place,
    });
  }
  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default PlaceAdd;
