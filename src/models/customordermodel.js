import { error } from "console";
import { main_db } from "../config/sqlite.js";
import crypto from "crypto";

main_db.run(`create table if not exists requests(
    requestId text primary key,
    userId text not null,
    title text not null,
    type text not null,
    image text not null,
    description text not null,
    budget text not null,
    requiredBy text not null,
    artisanId  text default null,
    isAccepted integer default 0,
    foreign key(userId) references users(userId) on delete cascade

)`);

main_db.run(
  `CREATE TRIGGER IF NOT EXISTS set_null_on_request_artisan_delete
AFTER DELETE on users
FOR EACH ROW
BEGIN
UPDATE requests
SET artisanId = NULL, isAccepted = 0
WHERE artisanId = OLD.userId;
END;`,
  (err) => {
    if (err) {
      console.error(
        "Error creating trigger set_null_on_request_artisan_delete :",
        err.message
      );
    } else {
      console.log("Trigger created successfully.");
    }
  }
);

export async function addRequest(
  userId,
  title,
  type,
  image,
  description,
  budget,
  requiredBy
) {
  return await new Promise((resolve, reject) => {
    main_db.run(
      `insert into requests ( 
            requestId,
            userId,
            title,
            type,
            image,
            description,
            budget,
            requiredBy
            ) values (?,?,?,?,?,?,?,?)`,
      [
        crypto.randomUUID(),
        userId,
        title,
        type,
        image,
        description,
        budget,
        requiredBy,
      ],
      (err) => {
        if (err) {
          console.error("DB error in addRequest: ", err.message);
          return reject(err);
        }
        console.log("request Added to DB");
        resolve({ success: true });
      }
    );
  });
}

export async function getRequests(isAccepted = null, artisanId = null) {
  let query = `select * from requests left join users on requests.userId = users.userId`;
  let params = [];
  if (!artisanId) {
    //true means the requests which are accepted and are 1
    if (isAccepted === true) {
      query += ` where isAccepted = ?`;
      params.push(1);
      //false means not accepted  which also means 0
    } else if (isAccepted === false) {
      query += ` where isAccepted = ?`;
      params.push(0);
    }
  }else{
    if(isAccepted === true){
      query+= ` where isAccepted = ? AND artisanId = ?`
      params.push(1)
      params.push(artisanId);
    }
  }

  return await new Promise((resolve, reject) => {
    main_db.all(query, params, (err, rows) => {
      if (err) {
        console.error("DB error in getRequests:", err);
        return reject(err);
      }
      resolve(rows || []);
    });
  });
}

export async function deleteRequest(requestId) {
  return new Promise((resolve, reject) => {
    main_db.all(
      "delete from requests where requestId = ?",
      [requestId],
      async (err) => {
        if (err) {
          console.error("Error deleting Request", error.message);
          return reject(err);
        } else {
          console.log("product deleted successfully");
          resolve({ success: true });
        }
      }
    );
  });
}

export async function approveRequest(requestId, artisanId) {
  return new Promise((resolve, reject) => {
    main_db.all(
      `update requests set isAccepted = ?, artisanId =? where requestId = ?`,
      [1, artisanId, requestId],
      (err) => {
        if (err) {
          console.error("error in approveRequest", err.message);
          return reject(err);
        } else {
          console.log("approved request");
          resolve({ success: true });
        }
      }
    );
  });
}
