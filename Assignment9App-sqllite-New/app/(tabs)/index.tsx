import { Stack, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

type UserType = { id: number; name: string; email: string };

export default function HomeScreen() {
  const [data, setData] = useState<UserType[]>([]);
  const database = useSQLiteContext();

  /** Load all users */
  const loadData = async () => {
    try {
      const result = await database.getAllAsync<UserType>(
        "SELECT * FROM users"
      );
      setData(result);
    } catch (err) {
      console.error("DB Fetch Error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  /** DELETE USER */
  const deleteUser = async (id: number) => {
    try {
      await database.runAsync("DELETE FROM users WHERE id = ?", [id]);
      loadData(); // refresh list
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteUser(id),
        },
      ]
    );
  };

  /** Header Right button (+) */
  const headerRight = () => (
    <TouchableOpacity
      onPress={() => router.push("/modal")}
      style={{ marginRight: 10 }}
    >
      <FontAwesome name="plus-circle" size={28} color="#080808ff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Home",
          headerRight,
          headerStyle: { backgroundColor: "#841617" },
          headerTintColor: "#FDF9F3",
        }}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {/* LEFT: name + email */}
            <View style={styles.textSection}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>

            {/* RIGHT: Edit + Delete */}
            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push(`/modal?id=${item.id}`)}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const OU_CRIMSON = "#841617";
const OU_CREAM = "#FDF9F3";
const OU_CRIMSON_DARK = "#5A0F10";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OU_CREAM,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: OU_CRIMSON,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  textSection: {
    flexDirection: "column",
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: OU_CRIMSON,
  },

  email: {
    fontSize: 14,
    color: "#444",
  },

  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  editText: {
    fontSize: 15,
    fontWeight: "600",
    color: OU_CRIMSON,
  },

  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  deleteText: {
    fontSize: 15,
    fontWeight: "600",
    color: OU_CRIMSON_DARK,
  },
});
