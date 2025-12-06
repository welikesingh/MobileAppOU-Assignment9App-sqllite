import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";

const OU_CRIMSON = "#841617";
const OU_CREAM = "#FDF9F3";
const OU_CRIMSON_DARK = "#5A0F10";
/*
  //  Define TYPE for user row
export type UserType = {
  id: number;
  name: string;
  email: string;
};
*/

export default function Modal() {

  const { id } = useLocalSearchParams();
  const userId = Number(id);
  const isEdit = !!userId;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const database = useSQLiteContext();

  /** Load user data if editing */
  const loadUser = async () => {
    if (!userId) return;

    const result = await database.getFirstAsync(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (result) {
      setName(result.name);
      setEmail(result.email);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  /** INSERT or UPDATE user */
  const handleSave = async () => {
    try {
      if (isEdit) {
        await database.runAsync(
          "UPDATE users SET name = ?, email = ? WHERE id = ?",
          [name, email, userId]
        );
      } else {
        await database.runAsync(
          "INSERT INTO users (name, email) VALUES (?, ?)",
          [name, email]
        );
      }
      router.back();
    } catch (error) {
      console.error("DB Save Error:", error);
    }
  };

  /** DELETE user */
  const confirmDelete = () => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await database.runAsync("DELETE FROM users WHERE id = ?", [userId]);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: isEdit ? "Edit User" : "Add User",
          headerStyle: { backgroundColor: OU_CRIMSON },
          headerTintColor: OU_CREAM,
        }}
      />

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter name"
          placeholderTextColor="#888"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter email"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>{isEdit ? "Update" : "Save"}</Text>
        </TouchableOpacity>
      </View>

      {isEdit && (
        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.deleteText}>Delete User</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: OU_CREAM,
  },

  form: {
    flex: 1,
    marginTop: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: OU_CRIMSON,
  },

  input: {
    borderWidth: 1,
    borderColor: OU_CRIMSON,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },

  cancelButton: {
    backgroundColor: "#b0b0b0",
  },

  saveButton: {
    backgroundColor: OU_CRIMSON,
  },

  buttonText: {
    color: OU_CREAM,
    fontWeight: "700",
    fontSize: 16,
  },

  deleteButton: {
    paddingVertical: 14,
    backgroundColor: OU_CRIMSON_DARK,
    borderRadius: 8,
    marginTop: 10,
  },

  deleteText: {
    color: OU_CREAM,
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});
