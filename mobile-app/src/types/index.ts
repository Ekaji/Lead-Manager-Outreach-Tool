export interface Lead {
  id?: number;
  business_name: string;
  category: string;
  location: string;
  phone: string;
  email?: string;
  website: string;
  rating: number;
  reviews: number;
  priority: "High" | "Medium" | "Low" | string;
  status: "New" | "Contacted" | "Won" | "Lost" | string;
  contacted_date?: string;
  response_date?: string;
  notes: string;
  tags: string;
  deal_value: string;
  next_follow_up?: string;
  has_website: boolean;
  extracted_at: string;
  created_at?: string;
}

export interface Template {
  id?: number;
  name: string;
  content: string;
  type: "whatsapp" | "email";
  subject?: string; // For emails
  created_at?: string;
}
