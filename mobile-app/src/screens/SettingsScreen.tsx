import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";

export const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Settings</Text>
      <Button mode="outlined" onPress={() => console.log("Backup")}>
        Backup Data
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
