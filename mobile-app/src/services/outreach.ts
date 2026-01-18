import { Linking, Alert } from "react-native";
import { Lead, Template } from "../types";

export const generateMessage = (template: Template, lead: Lead) => {
  let content = template.content;

  // Replace placeholders
  content = content.replace(/{name}/g, lead.business_name); // Fallback if name is not separate
  content = content.replace(/{business_name}/g, lead.business_name);
  content = content.replace(/{location}/g, lead.location);

  return content;
};

export const openWhatsApp = async (lead: Lead, message: string) => {
  if (!lead.phone) {
    Alert.alert("Error", "No phone number available");
    return false;
  }

  // Normalize phone (strip non-digits)
  const phone = lead.phone.replace(/[^\d+]/g, "");
  const encodedMessage = encodeURIComponent(message);

  const url = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
    return true;
  } else {
    Alert.alert("Error", "WhatsApp is not installed");
    return false;
  }
};

export const openEmail = async (lead: Lead, subject: string, body: string) => {
  // Simple email linking usually relies on "mailto:" which might not support rich body content perfectly across all clients
  // but it's the standard way without libraries like react-native-mail
  if (!lead.website && !lead.notes) {
    // We don't have an email field in the Lead interface!
    // I should check the IMPORT logic to see if we mapped Email.
    // Wait, the CSV headers had "Business Name", "Category", etc. but I didn't see explicit "Email".
    // Let me re-read the CSV structure from the plan.
  }

  return false;
};
