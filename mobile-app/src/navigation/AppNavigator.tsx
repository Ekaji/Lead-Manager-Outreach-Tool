import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootTabParamList, RootStackParamList } from "../types/navigation";
import { HomeScreen } from "../screens/HomeScreen";
import { TemplatesScreen } from "../screens/TemplatesScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { TemplateEditor } from "../screens/TemplateEditor";
import { LeadDetailsScreen } from "../screens/LeadDetailsScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Leads") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Templates") {
            iconName = focused ? "document-text" : "document-text-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "alert";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Leads" component={HomeScreen} />
      <Tab.Screen name="Templates" component={TemplatesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LeadDetails"
          component={LeadDetailsScreen}
          options={{ title: "Lead Details" }}
        />
        <Stack.Screen
          name="TemplateEditor"
          component={TemplateEditor}
          options={{ title: "Edit Template" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
