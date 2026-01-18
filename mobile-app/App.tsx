import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { initDB } from "./src/services/database";

export default function App() {
  useEffect(() => {
    initDB().catch((e) => console.error("DB Init Failed:", e));
  }, []);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
