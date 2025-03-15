import sqlite from "sqlite3";

const db = new sqlite.Database(":memory:", (err) => {
  if (!err) {
    console.log("Connected to SQLite in memory Database.");
  } else {
    console.log("Error in connecting to SQLite : ", err.message);
  }
});

export default db;
