import {
  ScrollView,
  Image,
  View,
  StyleSheet,
  Text,
  Alert,
  ActionSheetIOS,
  Platform,
  Share,
} from "react-native";
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

  async function sharePlaceHandler() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Share Image", "Share Location"],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Share Image
            try {
              await Share.share({
                url: fetchedPlace.imageUri, // Use URL field for sharing an image
                message: `Check out this place: ${fetchedPlace.title}`, // Optional message
              });
            } catch (error) {
              alert(error.message);
            }
          } else if (buttonIndex === 2) {
            // Share Location
            try {
              await Share.share({
                message: `Check out this place: ${fetchedPlace.title}\n\nLocation: https://www.google.com/maps/search/?api=1&query=${fetchedPlace.lat},${fetchedPlace.lng}`,
              });
            } catch (error) {
              alert(error.message);
            }
          }
        }
      );
    } else {
      Alert.alert("Share Options", "Choose what you'd like to share", [
        {
          text: "Share Image",
          onPress: async () => {
            try {
              await Share.share({
                url: fetchedPlace.imageUri, // Share the image URI on Android
                message: `Check out this place: ${fetchedPlace.title}`, // Optional message
              });
            } catch (error) {
              alert(error.message);
            }
          },
        },
        {
          text: "Share Location",
          onPress: async () => {
            try {
              await Share.share({
                message: `Check out this place: ${fetchedPlace.title}\n\nLocation: https://www.google.com/maps/search/?api=1&query=${fetchedPlace.lat},${fetchedPlace.lng}`,
              });
            } catch (error) {
              alert(error.message);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
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
        <CustomButton icon="share" onPress={sharePlaceHandler}>
          Share Place
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
