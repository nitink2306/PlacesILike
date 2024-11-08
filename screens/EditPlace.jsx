import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import PlaceForm from "../components/Places/PlaceForm";
import { fetchPlaceWithId, updatePlace } from "../util/database";
import { Colors } from "../constants/colors";

export default function EditPlace({ route, navigation }) {
  const [placeData, setPlaceData] = useState({});
  const placeId = route.params.placeId;

  useEffect(() => {
    async function loadPlaceData() {
      const data = await fetchPlaceWithId(placeId);

      const formattedData = {
        title: data.title,
        imageUri: data.imageUri,
        location: {
          latitude: data.lat,
          longitude: data.lng,
          address: data.address,
        },
        id: data.id,
      };

      setPlaceData(formattedData);
    }
    loadPlaceData();
  }, [placeId]);

  async function handleFormSubmit(updatedPlace) {
    await updatePlace(updatedPlace);
    navigation.navigate("PlaceDetails", { placeId }); // Return to PlaceDetails
  }

  if (!placeData) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    );
  }

  return <PlaceForm initialValues={placeData} onEditPlace={handleFormSubmit} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
