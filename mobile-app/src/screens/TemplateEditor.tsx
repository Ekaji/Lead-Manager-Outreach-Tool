import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  SegmentedButtons,
  HelperText,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { addTemplate } from "../services/database";

export const TemplateEditor = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("whatsapp");
  const [subject, setSubject] = useState("");

  const saveTemplate = async () => {
    if (!name || !content) {
      Alert.alert("Error", "Please fill Name and Content");
      return;
    }

    try {
      await addTemplate({
        name,
        content,
        type: type as "whatsapp" | "email",
        subject: type === "email" ? subject : undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save template");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Template Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: "whatsapp", label: "WhatsApp" },
          { value: "email", label: "Email" },
        ]}
        style={styles.input}
      />

      {type === "email" && (
        <TextInput
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          mode="outlined"
          style={styles.input}
        />
      )}

      <TextInput
        label="Message Content"
        value={content}
        onChangeText={setContent}
        mode="outlined"
        multiline
        numberOfLines={6}
        style={styles.input}
      />
      <HelperText type="info">
        Use placeholders: {`{name}`}, {`{business_name}`}, {`{location}`}
      </HelperText>

      <Button mode="contained" onPress={saveTemplate} style={styles.button}>
        Save Template
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
});
