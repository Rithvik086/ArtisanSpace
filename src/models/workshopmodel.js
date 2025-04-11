import mongoose, { Types } from "mongoose";

const workshopSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  workshopTitle: {
    type: String,
    required: true,
  },
  workshopDescription: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0, // 0 for pending, 1 for accepted
  },
  artisanId: {
    type: Types.ObjectId,
    ref: "User",
    default: null,
  },
  acceptedAt: {
    type: String,
    default: null,
  },
});

export default mongoose.model("Workshop", workshopSchema);

// import crypto from "crypto";
// import { getDb } from "../config/sqlite.js";

// const { main_db } = await getDb();

// async function initializeDatabase() {
//   await new Promise((resolve, reject) => {
//     main_db.run(
//       `CREATE TABLE IF NOT EXISTS workshops(
//   workshopId text primary key,
//   userId text not null,
//   workshopTitle text not null,
//   workshopDescription text not null,
//   date text not null,
//   time text not null,
//   status integer default 0,
//   artisanId text default null,
//   acceptedAt text default null,
//   foreign key(userId) references users(userId) on delete cascade)`,
//       (err) => {
//         if (err) {
//           console.log("Error in workshops table creation.", err.message);
//           return reject();
//         }
//       }
//     );

//     main_db.run(
//       `CREATE TRIGGER IF NOT EXISTS set_null_on_workshop_artisan_delete
//   AFTER DELETE on users
//   FOR EACH ROW
//   BEGIN
//   UPDATE workshops
//   SET artisanId = NULL, status = 0, acceptedAt = NULL
//   WHERE artisanId = OLD.userId;
//   END;`,
//       (err) => {
//         if (err) {
//           console.error(
//             "Error creating trigger set_null_on_workshop_artisan_delete:",
//             err.message
//           );
//           return reject();
//         } else {
//           console.log("Trigger created successfully.");
//           resolve();
//         }
//       }
//     );
//   });
// }

// await initializeDatabase();

// export async function bookWorkshop(
//   userId,
//   workshopTitle,
//   workshopDescription,
//   date,
//   time
// ) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(
//       `INSERT INTO workshops(
//       workshopId, userId, workshopTitle, workshopDescription, date, time)
//       values(?, ?, ?, ?, ?, ?)`,
//       [
//         crypto.randomUUID(),
//         userId,
//         workshopTitle,
//         workshopDescription,
//         date,
//         time,
//       ],
//       (err) => {
//         if (err) {
//           console.error("DB error in bookWorkshop: ", err.message);
//           return reject(err);
//         }
//         console.log("Workshop added in DB");
//         resolve({ success: true });
//       }
//     );
//   });
// }

// export async function getWorkshops(isAccepted = null) {
//   return await new Promise((resolve, reject) => {
//     let query = `SELECT * FROM workshops LEFT JOIN users ON workshops.userId = users.userId`;
//     let params = [];

//     if (isAccepted === true) {
//       query += ` WHERE status = ?`;
//       params.push(1);
//     } else if (isAccepted === false) {
//       query += ` WHERE status = ?`;
//       params.push(0);
//     }

//     main_db.all(query, params, (err, rows) => {
//       if (err) {
//         console.error("DB error in getWorkshops:", err.message);
//         return reject(err);
//       }
//       resolve(rows || []);
//     });
//   });
// }

// export async function getWorkshopById(workshopId) {
//   return await new Promise((resolve, reject) => {
//     main_db.get(
//       `SELECT * FROM workshops LEFT JOIN users ON workshops.userId = users.userId WHERE workshops.workshopId = ?`,
//       [workshopId],
//       (err, row) => {
//         if (err) {
//           console.error("DB error in getWorkshopById: ", err.message);
//           return reject(err);
//         }
//         resolve(row || null);
//       }
//     );
//   });
// }

// export async function acceptWorkshop(workshopId, artisanId) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(
//       `UPDATE workshops SET status = ?, artisanId = ?, acceptedAt = ? WHERE workshopId = ?`,
//       [1, artisanId, new Date().toISOString(), workshopId],
//       (err) => {
//         if (err) {
//           console.error("DB error in acceptWorkshop: ", err.message);
//           return reject(err);
//         }
//         console.log("Workshop accepted");
//         resolve({ success: true });
//       }
//     );
//   });
// }

// export async function removeWorkshop(workshopId) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(
//       `DELETE FROM workshops WHERE workshopId = ?`,
//       [workshopId],
//       (err) => {
//         if (err) {
//           console.error("DB error in removeWorkshop: ", err.message);
//           return reject(err);
//         }
//         console.log("Workshop removed from DB");
//         resolve({ success: true });
//       }
//     );
//   });
// }

// export async function getAvailableWorkshops() {
//   return await getWorkshops(false);
// }

// export async function getAcceptedWorkshops(artisanId = null) {
//   if (artisanId) {
//     return await new Promise((resolve, reject) => {
//       main_db.all(
//         `SELECT * FROM workshops LEFT JOIN users ON workshops.userId = users.userId WHERE workshops.status = 1 and workshops.artisanId = ?`,
//         [artisanId],
//         (err, rows) => {
//           if (err) {
//             console.error("DB error in getAcceptedWorkshop: ", err.message);
//             return reject(err);
//           }
//           resolve(rows || []);
//         }
//       );
//     });
//   } else {
//     return await getWorkshops(true);
//   }
// }
