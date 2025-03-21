import sqlite from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db_path = path.resolve(__dirname, "../../main.db");

export const cart_db = new sqlite.Database(":memory:", (err) => {
  if (!err) {
    console.log("Connected to SQLite in memory Database.");
  } else {
    console.log("Error in connecting to SQLite : ", err.message);
  }
});

export const main_db = new sqlite.Database(db_path, (err) => {
  if (!err) {
    console.log("Connected to SQLite main Database.");

    main_db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
      if (pragmaErr) {
        console.error("Error enabling foreign keys:", pragmaErr.message);
      } else {
        console.log("Foreign key constraints enabled.");
      }
    });
  } else {
    console.log("Error in connecting to main SQLite Database.");
  }
});
