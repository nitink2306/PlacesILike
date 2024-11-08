import { ScrollView, Image, View, StyleSheet, Text, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import CustomButton from "../components/UI/CustomButtom";
import { Colors } from "../constants/colors";
import { fetchPlaceWithId, deletePlace } from "../util/database";

export default function PlaceDetails({ route, navigation }) {
  const [fetchedPlace, setFetchedPlace] = useState();
  const selectedPlaceId = route.params.placeId;
  const isFocused = useIsFocused();

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: fetchedPlace.lat,
      initialLng: fetchedPlace.lng,
    });
  }

  function deletePlaceHandler() {
    Alert.alert("Delete Place", "Are you sure you want to delete this place?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deletePlace(selectedPlaceId);
          navigation.navigate("AllPlaces");
        },
      },
    ]);
  }

  function editPlaceHandler() {
    navigation.navigate("EditPlace", {
      placeId: selectedPlaceId,
    });
  }

  useEffect(() => {
    if (isFocused) {
      async function loadPlaceData() {
        const place = await fetchPlaceWithId(selectedPlaceId);
        setFetchedPlace(place);
        navigation.setOptions({
          title: place.title,
        });
      }
      loadPlaceData();
    }
  }, [isFocused, selectedPlaceId]);

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image source={{ uri: fetchedPlace.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <CustomButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </CustomButton>
        <CustomButton icon="pencil" onPress={editPlaceHandler}>
          Edit Place
        </CustomButton>
        <CustomButton icon="trash" onPress={deletePlaceHandler}>
          Delete Place
        </CustomButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
