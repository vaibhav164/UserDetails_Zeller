import { ZellerCustomer } from "../Components/CustomerList";
import SQLite from 'react-native-sqlite-storage';

export async function saveUser(db: SQLite.SQLiteDatabase, user: ZellerCustomer) {
  const insertQuery = `INSERT OR REPLACE INTO users (id, name, email, userType) VALUES (?, ?, ?, ?);`;
  await db.executeSql(insertQuery, [user.id, user.name, user.email ?? null, user.role]);
}

// Fetch all users
export async function getAllUsers(db: SQLite.SQLiteDatabase): Promise<ZellerCustomer[]> {
  const results = await db.executeSql('SELECT * FROM users');
  const users: ZellerCustomer[] = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      users.push(result.rows.item(i));
    }
  });
  return users;
}

// Delete user by id
export async function deleteUser(db: SQLite.SQLiteDatabase, id: string) {
  await db.executeSql('DELETE FROM users WHERE id = ?;', [id]);
}

export async function saveUsersBulk(
  db: SQLite.SQLiteDatabase,
  users: ZellerCustomer[]
): Promise<void> {
  for (const user of users) {
    await saveUser(db, user);
  }
}