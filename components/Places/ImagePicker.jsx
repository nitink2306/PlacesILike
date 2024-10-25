import { useState } from "react";
import { Button, View, Alert, StyleSheet, Text, Image } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  launchImageLibraryAsync,
} from "expo-image-picker";
import { Colors } from "../../constants/colors";
import CustomButton from "../UI/CustomButtom";

function ImagePicker({ onTakeImage }) {
  const [selectedImage, setSelectedImage] = useState();
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermission() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permission",
        "This app requires camera permission"
      );
      return false;
    }

    return true;
  }
  async function takeImageHandler() {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    console.log(image);
    setSelectedImage(image.assets[0].uri);
    onTakeImage(image.assets[0].uri);
  }
  async function uploadImageHandler() {
    const image = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    console.log(image);
    setSelectedImage(image.assets[0].uri);
    onTakeImage(image.assets[0].uri);
  }
  let imagePreview = <Text>No image selected</Text>;
  if (selectedImage) {
    imagePreview = (
      <Image style={styles.image} source={{ uri: selectedImage }} />
    );
  }
  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <View style={styles.buttonRow}>
        <CustomButton onPress={takeImageHandler} icon="camera">
          Take Image
        </CustomButton>
        <CustomButton onPress={uploadImageHandler} icon="share">
          Upload Image
        </CustomButton>
      </View>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    color: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
