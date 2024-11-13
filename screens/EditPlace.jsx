import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import PlaceForm from "../components/Places/PlaceForm";
import { fetchPlaceWithId, updatePlace } from "../util/database";
import { Colors } from "../constants/colors";

export default function EditPlace({ route, navigation }) {
  const [placeData, setPlaceData] = useState({});
  const [loading, setLoading] = useState(true);
  const placeId = route.params.placeId;

  useEffect(() => {
    async function loadPlaceData() {
      setLoading(true);
      const data = await fetchPlaceWithId(placeId);

      const formattedData = {
        title: data.title,
        imageUri: data.imageUri,
        location: {
          lat: data.lat,
          lng: data.lng,
        },
        id: data.id,
      };

      setPlaceData(formattedData);
      setLoading(false);
    }
    loadPlaceData();
  }, [placeId]);

  async function handleFormSubmit(updatedPlace) {
    console.log(updatedPlace);
    const formattedData = {
      title: updatedPlace.title,
      imageUri: updatedPlace.imageUri,
      address: updatedPlace.address,
      lat: updatedPlace.location.latitude,
      lng: updatedPlace.location.longitude,
      id: updatedPlace.id,
    };
    await updatePlace(formattedData);
    navigation.navigate("PlaceDetailed", { placeId });
  }

  if (!placeData) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    );
  }

  return (
    <PlaceForm
      initialValues={placeData}
      onEditPlace={handleFormSubmit}
      origin="EditPlace"
      placeId={placeId}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
