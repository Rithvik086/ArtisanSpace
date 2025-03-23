import crypto from "crypto";
import { removeCart } from "./cartmodel.js";
import { getDb } from "../config/sqlite.js";

const { main_db } = await getDb();

async function initializeDatabase() {
  await new Promise((resolve, reject) => {
    main_db.run(
      `create table if not exists users(
userId text primary key,
username text not null unique,
password text not null,
email text not null unique,
mobile_no text not null,
address text default null,
role text not null)`,
      (err) => {
        if (err) {
          console.log("Users table creation error.");
          return reject();
        }
        resolve();
      }
    );
  });
}

await initializeDatabase();

export async function userExist(userId) {
  return await new Promise((resolve, reject) => {
    main_db.get(
      "select * from users where userId = ?",
      [userId],
      (err, row) => {
        if (err) {
          console.error("DB error in userExist function");
          return reject(err);
        } else {
          resolve(row !== undefined);
        }
      }
    );
  });
}

export async function addUser(username, email, hashpass, mobile_no, role) {
  return await new Promise((resolve, reject) => {
    main_db.get(
      "select * from users where username = ? or email =?",
      [username, email],
      (err, rows) => {
        if (err) {
          console.error("DB error in retreving users in addUser");
          return reject(err);
        }
        if (rows) {
          return reject(new Error("Username or email already exists."));
        }
      }
    );
    main_db.run(
      "INSERT INTO users (userId, username, password, email, mobile_no, role) values (?, ?, ?, ?, ?, ?)",
      [crypto.randomUUID(), username, hashpass, email, mobile_no, role],
      (err) => {
        if (err) {
          console.error("DB error in addUser INSERT: ", err);
          return reject(err);
        }
        console.log("User added in DB");
        resolve({ success: true });
      }
    );
  });
}

export async function findUserByName(username) {
  return await new Promise((resolve, reject) => {
    main_db.get(
      "select * from users where username = ?",
      [username],
      (err, row) => {
        if (err) {
          console.error("DB error in select of findUserByName.", err);
          return reject(err);
        } else {
          resolve(row || null);
        }
      }
    );
  });
}

export async function getUserById(userId) {
  return await new Promise((resolve, reject) => {
    main_db.get(
      "select * from users where userId = ?",
      [userId],
      (err, row) => {
        if (err) {
          console.error("DB error in select of getUserById.", err);
          return reject(err);
        } else {
          resolve(row || null);
        }
      }
    );
  });
}

export async function getUsers() {
  return await new Promise((resolve, reject) => {
    main_db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        console.error("DB error in getUsers:", err);
        return reject(err);
      }
      resolve(rows || []);
    });
  });
}

export async function removeUser(userId) {
  return await new Promise((resolve, reject) => {
    main_db.run(`DELETE FROM users WHERE userId = ?`, [userId], async (err) => {
      if (err) {
        console.error("DB Error in removeUser.", err.message);
        return reject(err);
      } else {
        console.log("Successfully removed the user from DB.");
        try {
          await removeCart(userId);
          resolve({ success: true });
        } catch (error) {
          console.error("Error removing uesr cart.");
          reject(error);
        }
      }
    });
  });
}

// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import path, { resolve } from "path";
// import mongoose, { mongo, MongooseError } from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },

//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },

//   password: {
//     type: String,
//     required: true,
//   },

//   role: {
//     type: String,
//     required: true,
//     enum: ["admin", "artisan", "customer", "manager"],
//   },
// });

// export default mongoose.model("User", userSchema);
// export async function getUsers() {
//   return await readData(userPath);
// }
// export async function getUserById(userid) {
//   const users = await readData(userPath);
//   return users.find((user) => user.id === userid) || null;
// }
// export async function findUserByName(username) {
//   const users = await readData(userPath);
//   return users.find((user) => user.username === username) || null;
// }
// export async function addUser(username, email, hashpass, role) {
//   const users = await readData(userPath);
//
//   if (users.find((user) => user.email === email)) {
//     throw new Error("Email already exists.");
//   }
//
//   if (users.find((user) => user.username === username)) {
//     throw new Error("Username already exists.");
//   }
//
//   const newUser = {
//     id: Date.now(),
//     username,
//     email,
//     password: hashpass,
//     role,
//   };
//
//   users.push(newUser);
//   await writeData(users, userPath);
//   console.log("User added");
//   return { success: true, user: newUser };
// }
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// const userPath = path.join(__dirname, "../../users.json");
//
// // Ensure file exists
// async function ensureFileExists(filePath) {
//   try {
//     await fs.access(filePath);
//   } catch {
//     await fs.writeFile(filePath, "[]");
//   }
// }
//
// async function readData(filePath) {
//   await ensureFileExists(filePath);
//   const data = await fs.readFile(filePath, "utf8");
//   return JSON.parse(data);
// }
//
// async function writeData(data, filePath) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }
//
// export async function userExist(userId) {
//   const users = await readData(userPath);
//   const user = users.find((user) => user.id === userId);
//   if (user) {
//     return true;
//   } else {
//     return false;
//   }
// }
// export async function removeUser(userId) {
//   userId = parseInt(userId);
//   try {
//     const users = await readData(userPath);
//     const userIndex = users.findIndex((user) => user.id === userId);
//
//     if (userIndex !== -1) {
//       users.splice(userIndex, 1); //const users will work because array is mutable, but we can't reassign it
//       await writeData(users, userPath);
//
//       await removeCart(userId);
//
//       // await removeUserProduct(userId); //no use of this now
//
//       console.log("User deleted successfully.");
//       return {
//         success: true,
//         message: "User deleted successfully",
//       };
//     } else {
//       console.log("User doesn't exist");
//       return {
//         success: false,
//         message: "User doesn't exist",
//       };
//     }
//   } catch (error) {
//     console.error("Error removing user:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to remove user",
//     };
//   }
// }
