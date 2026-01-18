import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, FAB, Card, IconButton } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getTemplates, deleteTemplate } from "../services/database";
import { Template } from "../types";

export const TemplatesScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [templates, setTemplates] = useState<Template[]>([]);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to load templates", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTemplates();
    }, []),
  );

  const handleDelete = (id: number) => {
    Alert.alert("Delete Template", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTemplate(id);
          loadTemplates();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Template }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate("TemplateEditor", {
          templateId: item.id?.toString(),
        })
      }
    >
      <Card.Title
        title={item.name}
        subtitle={
          item.type === "email" ? `Email: ${item.subject}` : "WhatsApp Message"
        }
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => handleDelete(item.id!)}
          />
        )}
      />
      <Card.Content>
        <Text numberOfLines={2} variant="bodyMedium">
          {item.content}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No templates found. Create one!</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("TemplateEditor", {})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  empty: {
    alignItems: "center",
    marginTop: 50,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
