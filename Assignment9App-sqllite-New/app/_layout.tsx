import { Stack } from 'expo-router';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
export default function Layout() {
  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log("Create database if needed");
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);"
    );
  };

  return (
     <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}> 
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
    </SQLiteProvider>
  );
}
