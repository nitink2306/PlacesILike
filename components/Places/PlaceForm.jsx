import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";

import { Colors } from "../../constants/colors";
import { Place } from "../../models/place";
import SubmitButton from "../UI/SubmitButton";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

function PlaceForm({
  onCreatePlace,
  onEditPlace,
  initialValues,
  origin,
  placeId,
}) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [pickedLocation, setPickedLocation] = useState();

  useEffect(() => {
    if (initialValues) {
      console.log(initialValues.location);
      setEnteredTitle(initialValues.title || "");
      setSelectedImage(initialValues.imageUri || "");
      setPickedLocation(
        initialValues.location
          ? {
              lat: initialValues.location.lat,
              lng: initialValues.location.lng,
            }
          : null
      );
      console.log(pickedLocation);
    }
  }, [initialValues]);

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location) => {
    setPickedLocation(location);
  }, []);

  function savePlaceHandler() {
    const placeData = new Place(
      enteredTitle,
      selectedImage,
      pickedLocation || initialValues.location
    );

    if (initialValues && initialValues.id) {
      placeData.id = initialValues.id;
      onEditPlace(placeData);
    } else {
      onCreatePlace(placeData);
    }
  }

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={Colors.primary500} />
  //     </View>
  //   );
  // }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker
        onTakeImage={takeImageHandler}
        initialImage={selectedImage} // Pass selectedImage after loading
      />
      <LocationPicker
        onPickLocation={pickLocationHandler}
        initialLocation={
          pickedLocation
            ? { lat: pickedLocation.lat, lng: pickedLocation.lng }
            : undefined
        }
        origin={origin}
        placeId={placeId}
      />
      <SubmitButton onPress={savePlaceHandler}>
        {initialValues ? "Save Changes" : "Add Place"}
      </SubmitButton>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
