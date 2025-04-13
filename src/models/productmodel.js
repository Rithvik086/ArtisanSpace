import mongoose from "mongoose";
import { Types } from "mongoose";
import Cart from "./cartmodel.js";

const productSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  uploadedBy: {
    type: String,
    required: true,
    enum: {
      values: ["artisan", "manager"],
      message: "{VALUE} is not allowed to upload products.",
    },
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  quantity: {
    type: Number,
    default: 1,
    validate: {
      validator: Number.isInteger,
      mesage: "{VALUE} is not a valid number",
    },
  },
  description: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["approved", "pending", "disapproved"],
      message: "{VALUE} is not a valid status",
    },
  },
});

productSchema.pre(
  "deleteOne",
  { document: true, query: true },
  async function (next) {
    try {
      await Promise.all([Cart.deleteMany({ productId: this._id })]);
      next();
    } catch (error) {
      next(error);
    }
  }
);

export default mongoose.model("Product", productSchema);

// import { getDb } from "../config/sqlite.js";
// import { removeProductFromAllCarts } from "./cartmodel.js";
// import crypto from "crypto";
//
// const { main_db } = await getDb();
//
// async function initializeDatabase() {
//   await new Promise((resolve, reject) => {
//     main_db.run(
//       `create table if not exists products(
//       productId text primary key,
//       artisanId text not null,
//       name text not null,
//       type text not null,
//       image text not null,
//       oldPrice real not null,
//       newPrice real not null,
//       quantity integer default 1,
//       description text not null,
//       status text not null,
//       foreign key(artisanId) references users(userId) ON DELETE CASCADE
//       )`,
//       (err) => {
//         if (err) {
//           console.log("Products table creation error", err.message);
//           return reject(err);
//         }
//         resolve();
//       }
//     );
//   });
// }
//
// await initializeDatabase();
//
// export async function addProduct(
//   artisanId,
//   name,
//   type,
//   image,
//   oldPrice,
//   quantity,
//   description
// ) {
//   return await new Promise((resolve, reject) => {
//     oldPrice = parseFloat(oldPrice).toFixed(2);
//     quantity = parseInt(quantity);
//     const newPrice = (oldPrice - oldPrice * 0.1).toFixed(2);
//     main_db.run(
//       `insert into products (
// productId, artisanId, name, type, image, oldPrice, newPrice, quantity, description, status)
// values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         crypto.randomUUID(),
//         artisanId,
//         name,
//         type,
//         image,
//         parseFloat(oldPrice),
//         parseFloat(newPrice),
//         quantity,
//         description,
//         "pending",
//       ],
//       (err) => {
//         if (err) {
//           console.error("DB error in addProduct: ", err.message);
//           return reject(err);
//         }
//         console.log("Product added in DB");
//         resolve({ success: true });
//       }
//     );
//   });
// }
//
// export async function delProduct(productId) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(
//       "DELETE FROM products WHERE productId = ?",
//       [productId],
//       async (err) => {
//         if (err) {
//           console.error("Error deleting product from DB.", err.message);
//           return reject(err);
//         } else {
//           console.log("Product deleted successfully from DB.");
//           try {
//             await removeProductFromAllCarts(productId);
//             resolve({ success: true });
//           } catch (error) {
//             console.error("Error removing products from all carts.");
//             reject(error);
//           }
//         }
//       }
//     );
//   });
// }
//
// export async function getProducts(artisanId = null) {
//   let query = `SELECT * FROM products`;
//   let parms = [];
//
//   if (artisanId) {
//     query += ` WHERE artisanId = ?`;
//     parms.push(artisanId);
//   }
//   return await new Promise((resolve, reject) => {
//     main_db.all(query, parms, (err, rows) => {
//       if (err) {
//         console.error("DB error in getProducts:", err);
//         return reject(err);
//       }
//       resolve(rows || []);
//     });
//   });
// }
//
// export async function productCount(productId) {
//   return await new Promise((resolve, reject) => {
//     main_db.get(
//       `SELECT quantity as count FROM products WHERE productId = ? AND status = ?`,
//       [productId, "approved"],
//       (err, row) => {
//         if (err) {
//           console.error("DB error in productCount: ", err.message);
//           return reject(err);
//         } else {
//           console.log("successfully got the product count");
//           resolve(row ? row.count : 0);
//         }
//       }
//     );
//   });
// }
//
// export async function approveProduct(productId) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(
//       `UPDATE products SET status = ? WHERE productId = ?`,
//       ["approved", productId],
//       (err) => {
//         if (err) {
//           console.error("DB error in approveProduct: ", err.message);
//           return reject(err);
//         } else {
//           console.log("successfully approved the product");
//           resolve({ success: true });
//         }
//       }
//     );
//   });
// }
//
// export async function disapproveProduct(productId) {
//   return await new Promise((resolve, reject) => {
//     main_db.run(
//       `UPDATE products SET status = ? WHERE productId = ?`,
//       ["disapproved", productId],
//       (err) => {
//         if (err) {
//           console.error("DB error in disapproveProduct: ", err.message);
//           return reject(err);
//         } else {
//           console.log("successfully approved the product");
//           resolve({ success: true });
//         }
//       }
//     );
//   });
// }
//
// export async function getApprovedProducts(category = null) {
//   if (!category) {
//     return await new Promise((resolve, reject) => {
//       main_db.all(
//         `SELECT * FROM products WHERE status = ?`,
//         ["approved"],
//         (err, rows) => {
//           if (err) {
//             console.error("DB error in getApprovedProducts: ", err.message);
//             return reject(err);
//           } else {
//             console.log("successfully got the approved products");
//             resolve(rows || []);
//           }
//         }
//       );
//     });
//   } else {
//     let query = `SELECT * FROM products WHERE status = ? and type IN (?`;
//     let parms = ["approved"];
//
//     if (!Array.isArray(category)) {
//       parms.push(category);
//     } else {
//       category.forEach((type) => {
//         query += `, ?`;
//         parms.push(type);
//       });
//     }
//     query += `)`;
//     return await new Promise((resolve, reject) => {
//       main_db.all(query, parms, (err, rows) => {
//         if (err) {
//           console.error(
//             "DB error in getApprovedProducts(filter): ",
//             err.message
//           );
//           return reject(err);
//         } else {
//           console.log("successfully got the approved products(filter)");
//           resolve(rows || []);
//         }
//       });
//     });
//   }
// }
//
// export async function getDisapprovedProducts() {
//   return await new Promise((resolve, reject) => {
//     main_db.all(
//       `SELECT * FROM products WHERE status = ?`,
//       ["disapproved"],
//       (err, rows) => {
//         if (err) {
//           console.error("DB error in getDisapprovedProducts: ", err.message);
//           return reject(err);
//         } else {
//           console.log("successfully got the disapproved products");
//           resolve(rows || []);
//         }
//       }
//     );
//   });
// }
//
// export async function getPendingProducts() {
//   return await new Promise((resolve, reject) => {
//     main_db.all(
//       `SELECT * FROM products WHERE status = ?`,
//       ["pending"],
//       (err, rows) => {
//         if (err) {
//           console.error("DB error in getPendingProducts: ", err.message);
//           return reject(err);
//         } else {
//           console.log("successfully got the pending products");
//           resolve(rows || []);
//         }
//       }
//     );
//   });
// }
//
// export async function getProductsCount() {
//   return await new Promise((resolve, reject) => {
//     main_db.all(
//       `SELECT status, count(*) AS count FROM products GROUP BY status`,
//       (err, rows) => {
//         if (err) {
//           console.error("DB error in getProductsCount: ", err.message);
//           return reject(err);
//         } else {
//           console.log("successfully got the products count");
//
//           let counts = { approved: 0, pending: 0, disapproved: 0 };
//
//           rows.forEach(({ status, count }) => {
//             counts[status] = count;
//           });
//           resolve(counts);
//         }
//       }
//     );
//   });
// }
