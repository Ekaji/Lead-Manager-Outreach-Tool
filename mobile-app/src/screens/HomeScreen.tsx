import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Button, Card, Chip, Searchbar, FAB } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getLeads, getLeadStats } from "../services/database";
import { importLeadsVideo } from "../services/importer";
import { Lead } from "../types";

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, contacted: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getLeads();
      const statsData = await getLeadStats();
      setLeads(data);
      setStats(statsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleImport = async () => {
    try {
      const result = await importLeadsVideo();
      if (result.total > 0) {
        Alert.alert(
          "Import Success",
          `Added: ${result.added}\nSkipped: ${result.skipped}`,
        );
        loadData();
      } else {
        // User probably cancelled
      }
    } catch (error) {
      Alert.alert("Error", "Failed to import CSV");
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Lead }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate("LeadDetails", {
          leadId: item.id?.toString() || "",
        })
      }
    >
      <Card.Title
        title={item.business_name}
        subtitle={item.category}
        right={() => <Chip compact>{item.status}</Chip>}
      />
      <Card.Content>
        <Text variant="bodySmall">{item.location}</Text>
        {item.phone ? <Text variant="bodySmall">📞 {item.phone}</Text> : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stats}>
          <Text variant="titleMedium">Total: {stats.total}</Text>
          <Text variant="titleMedium">Contacted: {stats.contacted}</Text>
        </View>
        <Button
          mode="contained-tonal"
          icon="file-import"
          onPress={handleImport}
        >
          Import
        </Button>
      </View>

      <Searchbar
        placeholder="Search leads..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
      />

      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadData}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No leads found. Import some!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    elevation: 2,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  search: {
    margin: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  empty: {
    alignItems: "center",
    marginTop: 50,
  },
});
