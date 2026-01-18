import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";
import { Lead } from "../types";
import { addLead, getLeads } from "./database";

export const parseCSV = (content: string): any[] => {
  const result = Papa.parse(content, { header: true, skipEmptyLines: true });
  return result.data;
};

export const mapCSVToLead = (row: any): Lead => {
  // Mapping logic based on expected headers
  return {
    business_name: row["Business Name"] || row["Name"] || "Unknown",
    category: row["Category"] || "",
    location: row["Location"] || row["Address"] || "",
    phone: row["Phone"] || row["Phone Number"] || "",
    email: row["Email"] || "",
    website: row["Website"] || "",
    rating: parseFloat(row["Rating"] || "0"),
    reviews: parseInt(row["Reviews"] || "0"),
    priority: row["Priority"] || "Medium",
    status: row["Status"] || "New",
    contacted_date: row["Contacted Date"],
    response_date: row["Response Date"],
    notes: row["Notes"] || "",
    tags: row["Tags"] || "",
    deal_value: row["Deal Value"] || "",
    next_follow_up: row["Next Follow Up"],
    has_website: (row["Has Website"] || "").toLowerCase() === "yes",
    extracted_at: row["Extracted At"] || new Date().toISOString(),
  };
};

export const importLeadsVideo = async (): Promise<{
  total: number;
  skipped: number;
  added: number;
}> => {
  try {
    const file = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "text/comma-separated-values", "application/csv"],
      copyToCacheDirectory: true,
    });

    if (file.canceled) return { total: 0, skipped: 0, added: 0 };

    // In SDK 50+, using assets[0]
    const uri = file.assets[0].uri;
    const content = await FileSystem.readAsStringAsync(uri);
    const rows = parseCSV(content);

    const existingLeads = await getLeads();
    const existingPhones = new Set(existingLeads.map((l) => l.phone));

    let added = 0;
    let skipped = 0;

    for (const row of rows) {
      if (!row["Business Name"] && !row["Phone"]) continue; // Skip empty rows

      const lead = mapCSVToLead(row);

      // Simple deduplication by phone
      if (lead.phone && existingPhones.has(lead.phone)) {
        skipped++;
        continue;
      }

      await addLead(lead);
      added++;
    }

    return { total: rows.length, skipped, added };
  } catch (error) {
    console.error("Import Failed", error);
    throw error;
  }
};
