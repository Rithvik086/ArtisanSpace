import crypto from "crypto";
import { getDb } from "../config/sqlite.js";

const { main_db } = await getDb();

async function initializeDatabase() {
  await new Promise((resolve, reject) => {
    main_db.run(
      `CREATE TABLE IF NOT EXISTS workshops(
  workshopId text primary key,
  userId text not null,
  workshopTitle text not null,
  workshopDescription text not null,
  date text not null,
  time text not null,
  status integer default 0,
  artisanId text default null,
  acceptedAt text default null,
  foreign key(userId) references users(userId) on delete cascade)`,
      (err) => {
        if (err) {
          console.log("Error in workshops table creation.", err.message);
          return reject();
        }
      }
    );

    main_db.run(
      `CREATE TRIGGER IF NOT EXISTS set_null_on_workshop_artisan_delete
  AFTER DELETE on users
  FOR EACH ROW
  BEGIN
  UPDATE workshops
  SET artisanId = NULL, status = 0, acceptedAt = NULL
  WHERE artisanId = OLD.userId;
  END;`,
      (err) => {
        if (err) {
          console.error("Error creating trigger:", err.message);
          return reject();
        } else {
          console.log("Trigger created successfully.");
          resolve();
        }
      }
    );
  });
}

await initializeDatabase();

export async function bookWorkshop(
  userId,
  workshopTitle,
  workshopDescription,
  date,
  time
) {
  return await new Promise((resolve, reject) => {
    main_db.run(
      `INSERT INTO workshops(
      workshopId, userId, workshopTitle, workshopDescription, date, time) 
      values(?, ?, ?, ?, ?, ?)`,
      [
        crypto.randomUUID(),
        userId,
        workshopTitle,
        workshopDescription,
        date,
        time,
      ],
      (err) => {
        if (err) {
          console.error("DB error in bookWorkshop: ", err.message);
          return reject(err);
        }
        console.log("Workshop added in DB");
        resolve({ success: true });
      }
    );
  });
}

export async function getWorkshops(isAccepted = null) {
  return await new Promise((resolve, reject) => {
    let query = `SELECT * FROM workshops LEFT JOIN users ON workshops.userId = users.userId`;
    let params = [];

    if (isAccepted === true) {
      query += ` WHERE status = ?`;
      params.push(1);
    } else if (isAccepted === false) {
      query += ` WHERE status = ?`;
      params.push(0);
    }

    main_db.all(query, params, (err, rows) => {
      if (err) {
        console.error("DB error in getWorkshops:", err.message);
        return reject(err);
      }
      resolve(rows || []);
    });
  });
}

export async function acceptWorkshop(workshopId, artisanId) {
  return await new Promise((resolve, reject) => {
    main_db.run(
      `UPDATE workshops SET status = ?, artisanId = ?, acceptedAt = ? WHERE workshopId = ?`,
      [1, artisanId, new Date().toISOString(), workshopId],
      (err) => {
        if (err) {
          console.error("DB error in acceptWorkshop: ", err.message);
          return reject(err);
        }
        console.log("Workshop accepted");
        resolve({ success: true });
      }
    );
  });
}

export async function removeWorkshop(workshopId) {
  return await new Promise((resolve, reject) => {
    main_db.run(
      `DELETE FROM workshops WHERE workshopId = ?`,
      [workshopId],
      (err) => {
        if (err) {
          console.error("DB error in removeWorkshop: ", err.message);
          return reject(err);
        }
        console.log("Workshop removed from DB");
        resolve({ success: true });
      }
    );
  });
}

export async function getAvailableWorkshops() {
  return await getWorkshops(false);
}

export async function getAcceptedWorkshops(userId = null) {
  if (artisanId) {
    return await new Promise((resolve, reject) => {
      main_db.all(
        `SELECT * FROM workshops LEFT JOIN users ON workshops.userId = users.userId WHERE workshops.userId = ?`,
        [userId],
        (err, rows) => {
          if (err) {
            console.error("DB error in getAcceptedWorkshop: ", err.message);
            return reject(err);
          }
          resolve(rows || []);
        }
      );
    });
  } else {
    return await getWorkshops(true);
  }
}

// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const workshopspath = path.join(__dirname, "../../workshops.json");

// async function ensureFileExists(filePath) {
//   try {
//     await fs.access(filePath);
//   } catch {
//     await fs.writeFile(filePath, "[]");
//   }
// }

// async function readData(filePath) {
//   await ensureFileExists(filePath);
//   const data = await fs.readFile(filePath, "utf8");
//   return JSON.parse(data);
// }

// async function writeData(data, filePath) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }
// export async function bookWorkshop(
//   username,
//   email,
//   pno,
//   workshopTitle,
//   workshopDesc,
//   date,
//   scheduletime
// ) {
//   const workshops = await readData(workshopspath);
//   const newWorkshop = {
//     wid: Date.now().toString(), // Adding a unique ID for easier identification
//     username,
//     email,
//     pno,
//     workshopTitle,
//     workshopDesc,
//     date,
//     scheduletime,
//     isAccepted: false, // Default value is false (not accepted yet)
//     artisanId: null, // Will store the ID of the artisan who accepts the workshop
//     acceptedAt: null, // Will store the timestamp when the workshop is accepted
//   };

//   workshops.push(newWorkshop);
//   await writeData(workshops, workshopspath);
//   return { success: true, workshop: newWorkshop };
// }
// export async function getWorkshops(filter = {}) {
//   const workshops = await readData(workshopspath);
//
//   // If filter is provided, filter the workshops accordingly
//   if (Object.keys(filter).length > 0) {
//     return workshops.filter((workshop) => {
//       for (const [key, value] of Object.entries(filter)) {
//         if (workshop[key] !== value) return false;
//       }
//       return true;
//     });
//   }
//
//   return workshops;
// }
// export async function acceptWorkshop(workshopId, artisanId) {
//   return updateWorkshop(workshopId, {
//     isAccepted: true,
//     artisanId,
//     acceptedAt: new Date().toISOString(),
//   });
// }
// export async function removeWorkshop(workshopId) {
//   const workshops = await readData(workshopspath);
//   const index = workshops.findIndex((workshop) => workshop.id === workshopId);
//
//   if (index === -1) {
//     return { success: false, message: "Workshop not found" };
//   }
//
//   // Remove the workshop from the array
//   const removedWorkshop = workshops.splice(index, 1)[0];
//
//   await writeData(workshops, workshopspath);
//   return { success: true, workshop: removedWorkshop };
// }
// export async function getAvailableWorkshops() {
//   return getWorkshops({ isAccepted: false });
// }

// export async function getAcceptedWorkshops(artisanId = null) {
//   if (artisanId) {
//     return getWorkshops({ isAccepted: true, artisanId });
//   }
//   return getWorkshops({ isAccepted: true });
// }
