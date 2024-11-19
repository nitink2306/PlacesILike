import { Pressable, StyleSheet, Text } from "react-native";

import { Colors } from "../../constants/colors";

const Button = ({ onPress, children }) => {
  // Returns a customizable button component
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 6,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center", // Ensures consistent text alignment
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold", // Enhances text visibility
  },
});
