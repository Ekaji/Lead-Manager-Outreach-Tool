import * as SQLite from "expo-sqlite";
import { Lead, Template } from "../types";

let db: SQLite.SQLiteDatabase;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync("leads_manager.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT NOT NULL,
      category TEXT,
      location TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      rating REAL,
      reviews INTEGER,
      priority TEXT,
      status TEXT,
      contacted_date TEXT,
      response_date TEXT,
      notes TEXT,
      tags TEXT,
      deal_value TEXT,
      next_follow_up TEXT,
      has_website INTEGER,
      extracted_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL,
      subject TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database initialized");
};

export const addLead = async (lead: Lead) => {
  const result = await db.runAsync(
    `INSERT INTO leads (
      business_name, category, location, phone, email, website, rating, reviews, 
      priority, status, contacted_date, response_date, notes, tags, 
      deal_value, next_follow_up, has_website, extracted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lead.business_name,
      lead.category,
      lead.location,
      lead.phone,
      lead.email || null,
      lead.website,
      lead.rating,
      lead.reviews,
      lead.priority,
      lead.status,
      lead.contacted_date || null,
      lead.response_date || null,
      lead.notes,
      lead.tags,
      lead.deal_value,
      lead.next_follow_up || null,
      lead.has_website ? 1 : 0,
      lead.extracted_at,
    ],
  );
  return result.lastInsertRowId;
};

export const getLeads = async (): Promise<Lead[]> => {
  const allRows = await db.getAllAsync(
    "SELECT * FROM leads ORDER BY created_at DESC",
  );
  return allRows.map((row: any) => ({
    ...row,
    has_website: row.has_website === 1,
  })) as Lead[];
};

export const getLeadStats = async () => {
  const total = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM leads",
  );
  const contacted = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM leads WHERE status = 'Contacted'",
  );

  return {
    total: total?.count || 0,
    contacted: contacted?.count || 0,
  };
};

export const clearLeads = async () => {
  await db.execAsync("DELETE FROM leads");
};

export const addTemplate = async (template: Template) => {
  const result = await db.runAsync(
    "INSERT INTO templates (name, content, type, subject) VALUES (?, ?, ?, ?)",
    [template.name, template.content, template.type, template.subject || null],
  );
  return result.lastInsertRowId;
};

export const getTemplates = async (): Promise<Template[]> => {
  return await db.getAllAsync(
    "SELECT * FROM templates ORDER BY created_at DESC",
  );
};

export const deleteTemplate = async (id: number) => {
  await db.runAsync("DELETE FROM templates WHERE id = ?", [id]);
};

export const updateLeadStatus = async (id: number, status: string) => {
  await db.runAsync(
    "UPDATE leads SET status = ?, contacted_date = ? WHERE id = ?",
    [status, new Date().toISOString(), id],
  );
};
