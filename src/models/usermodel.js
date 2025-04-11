import mongoose from "mongoose";
import Product from "./productmodel.js";

const userSchema = new mongoose.schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile_no: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: ["admin", "manager", "artisan", "customer"],
      message: "{VALUE} is not a valid role",
    },
  },
});

userSchema.pre("remove", async function (next) {
  try {
    await Product.deleteMany({ artisanId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("User", userSchema);

// import crypto from "crypto";
// import { removeCart } from "./cartmodel.js";
// import { getDb } from "../config/sqlite.js";
//
// const { main_db } = await getDb();
//
// async function initializeDatabase() {
//   await new Promise((resolve, reject) => {
//     main_db.run(
//       `create table if not exists users(
// userId text primary key,
// username text not null unique,
// name text not null,
// password text not null,
// email text not null unique,
// mobile_no text not null,
// address text default null,
// role text not null)`,
//       (err) => {
//         if (err) {
//           console.log("Users table creation error.");
//           return reject();
//         }
//         resolve();
//       },
//     );
//   });
// }
//
// await initializeDatabase();
//
// export async function userExist(userId) {
//   return await new Promise((resolve, reject) => {
//     main_db.get(
//       "select * from users where userId = ?",
//       [userId],
//       (err, row) => {
//         if (err) {
//           console.error("DB error in userExist function");
//           return reject(err);
//         } else {
//           resolve(row !== undefined);
//         }
//       },
//     );
//   });
// }
//
// export async function addUser(
//   username,
//   name,
//   email,
//   hashpass,
//   mobile_no,
//   role,
// ) {
//   return await new Promise((resolve, reject) => {
//     main_db.get(
//       "select * from users where username = ? or email =?",
//       [username, email],
//       (err, rows) => {
//         if (err) {
//           console.error("DB error in retreving users in addUser");
//           return reject(err);
//         }
//         if (rows) {
//           return reject(new Error("Username or email already exists."));
//         }
//       },
//     );
//     main_db.run(
//       "INSERT INTO users (userId, username, name, password, email, mobile_no, role) values (?, ?, ?, ?, ?, ?, ?)",
//       [crypto.randomUUID(), username, name, hashpass, email, mobile_no, role],
//       (err) => {
//         if (err) {
//           console.error("DB error in addUser INSERT: ", err);
//           return reject(err);
//         }
//         console.log("User added in DB");
//         resolve({ success: true });
//       },
//     );
//   });
// }
//
// export async function findUserByName(username) {
//   return await new Promise((resolve, reject) => {
//     main_db.get(
//       "select * from users where username = ?",
//       [username],
//       (err, row) => {
//         if (err) {
//           console.error("DB error in select of findUserByName.", err);
//           return reject(err);
//         } else {
//           resolve(row || null);
//         }
//       },
//     );
//   });
// }
//
// export async function getUserById(userId) {
//   return await new Promise((resolve, reject) => {
//     main_db.get(
//       "select * from users where userId = ?",
//       [userId],
//       (err, row) => {
//         if (err) {
//           console.error("DB error in select of getUserById.", err);
//           return reject(err);
//         } else {
//           resolve(row || null);
//         }
//       },
//     );
//   });
// }
//
// export async function getUsers() {
//   return await new Promise((resolve, reject) => {
//     main_db.all("SELECT * FROM users", (err, rows) => {
//       if (err) {
//         console.error("DB error in getUsers:", err);
//         return reject(err);
//       }
//       resolve(rows || []);
//     });
//   });
// }
//
// export async function removeUser(userId) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(`DELETE FROM users WHERE userId = ?`, [userId], async (err) => {
//       if (err) {
//         console.error("DB Error in removeUser.", err.message);
//         return reject(err);
//       } else {
//         console.log("Successfully removed the user from DB.");
//         try {
//           await removeCart(userId);
//           resolve({ success: true });
//         } catch (error) {
//           console.error("Error removing uesr cart.");
//           reject(error);
//         }
//       }
//     });
//   });
// }
//
// export async function updateUser(userId, name, mobile_no, address) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(
//       `UPDATE users SET name = ?, mobile_no = ?, address = ? WHERE userId = ?`,
//       [name, mobile_no, address, userId],
//       async (err) => {
//         if (err) {
//           console.error("DB Error in updateUser.", err.message);
//           return reject(err);
//         } else {
//           console.log("Successfully updated the user.");
//           resolve({ success: true });
//         }
//       },
//     );
//   });
// }
