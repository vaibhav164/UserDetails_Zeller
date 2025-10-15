import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = 'users.db';
const DATABASE_LOCATION = 'default';
const TABLE_USERS = 'users';

export interface Customer {
  id: string;
  name: string;
  role: 'Admin' | 'Manager';
}

export async function getDBConnection(): Promise<SQLiteDatabase> {
  return SQLite.openDatabase({ name: DATABASE_NAME, location: DATABASE_LOCATION });
}

export async function createTables(db: SQLiteDatabase): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS ${TABLE_USERS} (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `;
  await db.executeSql(query);
}

export async function saveUsers(db: SQLiteDatabase, users: Customer[]): Promise<void> {
  if (users.length === 0) return;

  const placeholders = users.map(() => '(?, ?, ?)').join(',');
  const values: (string)[] = [];

  users.forEach(user => {
    values.push(user.id, user.name, user.role);
  });

  const insertQuery = `
    INSERT OR REPLACE INTO ${TABLE_USERS} (id, name, role)
    VALUES ${placeholders};
  `;

  await db.executeSql(insertQuery, values);
}

export async function getUsers(db: SQLiteDatabase): Promise<Customer[]> {
  const results = await db.executeSql(`SELECT * FROM ${TABLE_USERS};`);
  const users: Customer[] = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      users.push(result.rows.item(i) as Customer);
    }
  });
  return users;
}
