export type RootTabParamList = {
  Leads: undefined;
  Templates: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  LeadDetails: { leadId: string };
  TemplateEditor: { templateId?: string };
};
