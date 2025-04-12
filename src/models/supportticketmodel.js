import mongoose, { Types } from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  subject: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: {
      values: ["open", "in-progress", "closed"],
      message: "{VALUE} is not a valid status",
    },
    default: "open",
  },
});

export default mongoose.model("Ticket", ticketSchema);

// import crypto from "crypto";
// import { getDb } from "../config/sqlite.js";

// const { main_db } = await getDb();

// async function initializeDatabase() {
//   await new Promise((resolve, reject) => {
//     main_db.run(
//       `CREATE TABLE IF NOT EXISTS tickets(
//   ticketId text primary key,
//   userId text not null,
//   subject text not null,
//   category text not null,
//   description text not null,
//   createdAt text not null,
//   foreign key(userId) references users(userId) ON DELETE CASCADE
//   )`,
//       (err) => {
//         if (err) {
//           console.log("Tickets table creation error", err.message);
//           return reject(err);
//         }
//         resolve();
//       }
//     );
//   });
// }

// await initializeDatabase();

// export async function addTicket(userId, subject, category, description) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(
//       `INSERT INTO tickets(
//         ticketId, userId, subject, category, description, createdAt) values (?, ?, ?, ?, ?, ?
//         )`,
//       [
//         crypto.randomUUID(),
//         userId,
//         subject,
//         category,
//         description,
//         new Date().toISOString(),
//       ],
//       (err) => {
//         if (err) {
//           console.error("DB error in addTicket: ", err.message);
//           return reject(err);
//         }
//         console.log("Ticket added in DB");
//         resolve({ success: true });
//       }
//     );
//   });
// }

// export async function getTickets() {
//   return await new Promise((resolve, reject) => {
//     main_db.all(
//       `SELECT * FROM tickets LEFT JOIN users ON tickets.userId = users.userId`,
//       (err, rows) => {
//         if (err) {
//           console.error("DB error in getTickets:", err.message);
//           return reject(err);
//         }
//         resolve(rows || []);
//       }
//     );
//   });
// }

// export async function removeTicket(ticketId) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(`DELETE FROM tickets WHERE ticketId = ?`, [ticketId], (err) => {
//       if (err) {
//         console.error("DB error in deleting ticket:", err.message);
//         return reject(err);
//       } else {
//         console.log("Ticket deleted successfully from DB");
//         resolve({ success: true });
//       }
//     });
//   });
// }
