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

export async function addUser(username, email, hashpass, role) {
  const users = await readData(userPath);

  if (users.find((user) => user.username === username)) {
    throw new Error("Username already exists.");
  }
  if (users.find((user) => user.email === email)) {
    throw new Error("Email already exists.");
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
}

export async function findUserByName(username) {
  const users = await readData(userPath);
  return users.find((user) => user.username === username) || null;
}
