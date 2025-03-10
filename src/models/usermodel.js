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
const userPath = "./users.json";

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
  const users = await readData();
  return users.find((user) => user.username === username) || null;
}
