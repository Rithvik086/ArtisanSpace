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

import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { removeCart } from "./cartmodel.js";
import { removeUserProduct } from "./productmodel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userPath = path.join(__dirname, "../../users.json");

// Ensure file exists
async function ensureFileExists(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]");
  }
}

async function readData(filePath) {
  await ensureFileExists(filePath);
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function writeData(data, filePath) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function userExist(userId) {
  const users = await readData(userPath);
  const user = users.find((user) => user.id === userId);
  if (user) {
    return true;
  } else {
    return false;
  }
}

export async function addUser(username, email, hashpass, role) {
  const users = await readData(userPath);

  if (users.find((user) => user.email === email)) {
    throw new Error("Email already exists.");
  }

  if (users.find((user) => user.username === username)) {
    throw new Error("Username already exists.");
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password: hashpass,
    role,
  };

  users.push(newUser);
  await writeData(users, userPath);
  console.log("User added");
  return { success: true };
}

export async function findUserByName(username) {
  const users = await readData(userPath);
  return users.find((user) => user.username === username) || null;
}

export async function getUserById(userid) {
  const users = await readData(userPath);
  return users.find((user) => user.id === userid) || null;
}

export async function getUsers() {
  return await readData(userPath);
}

export async function removeUser(userId) {
  userId = parseInt(userId);
  try {
    const users = await readData(userPath);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      users.splice(userIndex, 1); //const users will work because array is mutable, but we can't reassign it
      await writeData(users, userPath);

      await removeCart(userId);

      await removeUserProduct(userId);

      console.log("User deleted successfully.");
      return {
        success: true,
        message: "User deleted successfully",
      };
    } else {
      console.log("User doesn't exist");
      return {
        success: false,
        message: "User doesn't exist",
      };
    }
  } catch (error) {
    console.error("Error removing user:", error);
    return {
      success: false,
      message: error.message || "Failed to remove user",
    };
  }
}
