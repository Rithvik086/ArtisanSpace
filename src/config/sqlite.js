import sqlite from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db_path = path.resolve(__dirname, "../../main.db");

let cart_db;
let main_db;
let initializationPromise = null;

export function initializeDatabases() {
  if (initializationPromise) return initializationPromise;
  initializationPromise = new Promise((resolve, reject) => {
    cart_db = new sqlite.Database(":memory:", (err) => {
      if (err) {
        console.error(
          "Error in connecting to SQLite in-memory Database:",
          err.message
        );
        return reject(err);
      }
      console.log("Connected to SQLite in-memory Database.");
    });

    main_db = new sqlite.Database(db_path, (err) => {
      if (!err) {
        console.log("Connected to SQLite main Database.");

        main_db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
          if (pragmaErr) {
            console.error("Error enabling foreign keys:", pragmaErr.message);
            return reject(err);
          } else {
            console.log("Foreign key constraints enabled.");
          }
        });
      } else {
        console.log("Error in connecting to main SQLite Database.");
        return reject(err);
      }
      resolve();
    });
  });

  return initializationPromise;
}

export async function getDb() {
  await initializeDatabases();
  return { cart_db, main_db };
}
