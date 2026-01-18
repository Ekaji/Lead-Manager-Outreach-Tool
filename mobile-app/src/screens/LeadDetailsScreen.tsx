import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import {
  Text,
  Button,
  Card,
  Divider,
  Portal,
  List,
  RadioButton,
  Provider,
  Modal,
} from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Lead, Template } from "../types";
import { getLeads, getTemplates, updateLeadStatus } from "../services/database";
import { generateMessage, openWhatsApp } from "../services/outreach";

export const LeadDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { leadId } = route.params;

  const [lead, setLead] = useState<Lead | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"whatsapp" | "email">(
    "whatsapp",
  );
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);

  useEffect(() => {
    getLeads().then((leads) => {
      const found = leads.find((l) => l.id?.toString() === leadId);
      if (found) setLead(found);
    });
    getTemplates().then(setTemplates);
  }, [leadId]);

  const showModal = (action: "whatsapp" | "email") => {
    setSelectedAction(action);
    setFilteredTemplates(templates.filter((t) => t.type === action));
    setVisible(true);
  };

  const handleTemplateSelect = async (template: Template) => {
    setVisible(false);
    if (!lead) return;

    const message = generateMessage(template, lead);

    if (selectedAction === "whatsapp") {
      const success = await openWhatsApp(lead, message);
      if (success) {
        await updateLeadStatus(lead.id!, "Contacted");
        setLead({ ...lead, status: "Contacted" });
      }
    } else {
      // Open Email
      const url = `mailto:${lead.email || ""}?subject=${encodeURIComponent(template.subject || "")}&body=${encodeURIComponent(message)}`;
      Linking.openURL(url);
      await updateLeadStatus(lead.id!, "Contacted");
      setLead({ ...lead, status: "Contacted" });
    }
  };

  if (!lead)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={lead.business_name} subtitle={lead.category} />
        <Card.Content>
          <Text>📍 {lead.location}</Text>
          <Text>📞 {lead.phone}</Text>
          {lead.email && <Text>📧 {lead.email}</Text>}
          <Text>🌐 {lead.website}</Text>
          <Divider style={{ marginVertical: 10 }} />
          <Text>Status: {lead.status}</Text>
          <Text>Priority: {lead.priority}</Text>
          <Text>Tags: {lead.tags}</Text>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          icon="whatsapp"
          onPress={() => showModal("whatsapp")}
          style={styles.button}
        >
          WhatsApp
        </Button>
        <Button
          mode="contained"
          icon="email"
          onPress={() => showModal("email")}
          style={styles.button}
        >
          Email
        </Button>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleMedium" style={{ marginBottom: 10 }}>
            Select {selectedAction === "whatsapp" ? "WhatsApp" : "Email"}{" "}
            Template
          </Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {filteredTemplates.map((t) => (
              <List.Item
                key={t.id}
                title={t.name}
                description={t.content}
                onPress={() => handleTemplateSelect(t)}
                left={(props) => (
                  <List.Icon {...props} icon="file-document-outline" />
                )}
              />
            ))}
            {filteredTemplates.length === 0 && <Text>No templates found.</Text>}
          </ScrollView>
          <Button onPress={() => setVisible(false)} style={{ marginTop: 10 }}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    width: "45%",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});
