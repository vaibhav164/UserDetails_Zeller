import SQLite from 'react-native-sqlite-storage';

const DB_NAME = 'zeller_customers.db';
const DB_LOCATION = 'default';

export async function getDBConnection() {
  return SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION });
}

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    userType TEXT NOT NULL
  );
`;

export async function createTables(db: SQLite.SQLiteDatabase) {
  await db.executeSql(createUserTableQuery);
}