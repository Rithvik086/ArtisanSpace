import crypto from "crypto";
import { main_db } from "../config/sqlite.js";

// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import path from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// const ticketPath = path.join(__dirname,"../../tickets.json");
// async function ensureFileExists(filePath) {
//     try {
//       await fs.access(filePath);
//     } catch {
//       await fs.writeFile(filePath, "[]");
//     }
//   }
//
//   async function readData(filePath) {
//     await ensureFileExists(filePath);
//     const data = await fs.readFile(filePath, "utf8");
//     return JSON.parse(data);
//   }
//
//   async function writeData(data, filePath) {
//     await fs.writeFile(filePath, JSON.stringify(data, null, 2));
//   }

main_db.run(`CREATE TABLE IF NOT EXISTS tickets(
ticketId text primary key,
userId text not null,
subject text not null,
category text not null,
description text not null,
createdAt text not null,
foreign key(userId) references users(userId) ON DELETE CASCADE
)`);

export async function addTicket(userId, subject, category, description) {
  return new Promise((resolve, reject) => {
    main_db.run(
      `INSERT INTO tickets(
ticketId, userId, subject, category, description, createdAt) values (?, ?, ?, ?, ?, ?
)`,
      [
        crypto.randomUUID(),
        userId,
        subject,
        category,
        description,
        new Date().toISOString(),
      ],
      (err) => {
        if (err) {
          console.error("DB error in addTicket: ", err.message);
          return reject(err);
        }
        console.log("Ticket added in DB");
        resolve({ success: true });
      }
    );
  });
}

export async function getTickets() {
  return new Promise((resolve, reject) => {
    main_db.all(
      `SELECT * FROM tickets LEFT JOIN users ON tickets.userId = users.userId`,
      (err, rows) => {
        if (err) {
          console.error("DB error in getTickets:", err.message);
          return reject(err);
        }
        resolve(rows || []);
      }
    );
  });
}

export async function removeTicket(ticketId) {
  return new Promise((resolve, reject) => {
    main_db.run(`DELETE FROM tickets WHERE ticketId = ?`, [ticketId], (err) => {
      if (err) {
        console.error("DB error in deleting ticket:", err.message);
        return reject(err);
      } else {
        console.log("Ticket deleted successfully from DB");
        resolve({ success: true });
      }
    });
  });
}

// export async function getTickets() {
//   return await readData(ticketPath);
// }
// export async function removeTicket(ticketId) {
//   let tickets = await readData(ticketPath);
//   const initialLength = tickets.length;
//
//   tickets = tickets.filter((ticket) => ticket.ticketId !== ticketId);
//
//   if (tickets.length === initialLength) {
//     return { success: false, message: "Ticket not found" };
//   }
//
//   await writeData(tickets, ticketPath);
//   return { success: true, message: "Ticket removed successfully" };
// }
// export async function addTicket(
//   fullname,
//   email,
//   pno,
//   role,
//   subject,
//   category,
//   desc,
// ) {
//   const tickets = await readData(ticketPath);
//   const newTicket = {
//     ticketId: crypto.randomUUID(),
//     fullname,
//     email,
//     pno,
//     role,
//     subject,
//     category,
//     desc,
//     createdAt: new Date().toISOString(),
//   };
//
//   tickets.push(newTicket);
//   await writeData(tickets, ticketPath);
//   // console.log("ticket added");
//   return { success: true, ticket: newTicket };
// }
