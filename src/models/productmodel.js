import { main_db } from "../config/sqlite.js";
import { removeProductFromAllCarts } from "./cartmodel.js";
import crypto from "crypto";

main_db.run(`create table if not exists products(
productId text primary key,
artisanId text not null,
name text not null,
type text not null,
image text not null,
oldPrice real not null,
newPrice real not null,
quantity integer default 1,
description text not null,
status text not null,
foreign key(artisanId) references users(userId) ON DELETE CASCADE
)`);

export async function addProduct(
  artisanId,
  name,
  type,
  image,
  oldPrice,
  quantity,
  description
) {
  return new Promise((resolve, reject) => {
    oldPrice = parseFloat(oldPrice).toFixed(2);
    quantity = parseInt(quantity);
    const newPrice = (oldPrice - oldPrice * 0.1).toFixed(2);
    main_db.run(
      `insert into products (
productId, artisanId, name, type, image, oldPrice, newPrice, quantity, description, status) 
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        crypto.randomUUID(),
        artisanId,
        name,
        type,
        image,
        parseFloat(oldPrice),
        parseFloat(newPrice),
        quantity,
        description,
        "pending",
      ],
      (err) => {
        if (err) {
          console.error("DB error in addProduct: ", err.message);
          return reject(err);
        }
        console.log("Product added in DB");
        resolve({ success: true });
      }
    );
  });
}

export async function delProduct(productId) {
  return new Promise((resolve, reject) => {
    main_db.run(
      "DELETE FROM products WHERE productId = ?",
      [productId],
      async (err) => {
        if (err) {
          console.error("Error deleting product from DB.", err.message);
          return reject(err);
        } else {
          console.log("Product deleted successfully from DB.");
          try {
            await removeProductFromAllCarts(productId);
            resolve({ success: true });
          } catch (error) {
            console.error("Error removing products from all carts.");
            reject(error);
          }
        }
      }
    );
  });
}

export async function getProducts() {
  return new Promise((resolve, reject) => {
    main_db.all(
      "SELECT * FROM products WHERE status = ?",
      ["approved"],
      (err, rows) => {
        if (err) {
          console.error("DB error in getProducts:", err);
          return reject(err);
        }
        resolve(rows || []);
      }
    );
  });
}

export async function productCount(productId) {
  return new Promise((resolve, reject) => {
    main_db.get(
      `SELECT quantity as count FROM products WHERE productId = ? AND status = ?`,
      [productId, "approved"],
      (err, row) => {
        if (err) {
          console.error("DB error in productCount: ", err.message);
          return reject(err);
        } else {
          console.log("successfully got the product count");
          resolve(row ? row.count : 0);
        }
      }
    );
  });
}

export async function approveProduct(productId) {
  return new Promise((resolve, reject) => {
    main_db.run(
      `UPDATE products SET status = ? WHERE productId = ?`,
      ["approved", productId],
      (err) => {
        if (err) {
          console.error("DB error in approveProduct: ", err.message);
          return reject(err);
        } else {
          console.log("successfully approved the product");
          resolve({ success: true });
        }
      }
    );
  });
}

export async function disapproveProduct(productId) {
  return new Promise((resolve, reject) => {
    main_db.run(
      `UPDATE products SET status = ? WHERE productId = ?`,
      ["disapproved", productId],
      (err) => {
        if (err) {
          console.error("DB error in disapproveProduct: ", err.message);
          return reject(err);
        } else {
          console.log("successfully approved the product");
          resolve({ success: true });
        }
      }
    );
  });
}

export async function getApprovedProducts() {
  return new Promise((resolve, reject) => {
    main_db.all(
      `SELECT * FROM products WHERE status = ?`,
      ["approved"],
      (err, rows) => {
        if (err) {
          console.error("DB error in getApprovedProducts: ", err.message);
          return reject(err);
        } else {
          console.log("successfully got the approved products");
          resolve(rows || []);
        }
      }
    );
  });
}

export async function getDisapprovedProducts() {
  return new Promise((resolve, reject) => {
    main_db.all(
      `SELECT * FROM products WHERE status = ?`,
      ["disapproved"],
      (err, rows) => {
        if (err) {
          console.error("DB error in getDisapprovedProducts: ", err.message);
          return reject(err);
        } else {
          console.log("successfully got the disapproved products");
          resolve(rows || []);
        }
      }
    );
  });
}

export async function getPendingProducts() {
  return new Promise((resolve, reject) => {
    main_db.all(
      `SELECT * FROM products WHERE status = ?`,
      ["pending"],
      (err, rows) => {
        if (err) {
          console.error("DB error in getPendingProducts: ", err.message);
          return reject(err);
        } else {
          console.log("successfully got the pending products");
          resolve(rows || []);
        }
      }
    );
  });
}

// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import path from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// const productPath = path.join(__dirname, "../../products.json");
//
// async function ensureFileExists(filePath) {
//   try {
//     await fs.access(filePath);
//   } catch {
//     await fs.writeFile(filePath, "[]");
//   }
// }
//
// async function readData(filePath) {
//   await ensureFileExists(filePath);
//   const data = await fs.readFile(filePath, "utf8");
//   return JSON.parse(data);
// }
//
// async function writeData(data, filePath) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }

// export async function productCount(productId) {
//   productId = parseInt(productId);
//   const products = await readData(productPath);
//
//   const product = products.find((product) => product.id === productId);
//   return product.quantity;
// }
// export async function removeUserProduct(userId) {
//   userId = parseInt(userId);
//   const products = await readData(productPath);
//
//   for (let product of products) {
//     if (product.aID === userId) {
//       await delProduct(product.id);
//     }
//   }
// }

// export async function getProducts() {
//   return await readData(productPath);
// }
// export async function delProduct(productId) {
//   productId = parseInt(productId);
//   const products = await readData(productPath);
//
//   const productIndex = products.findIndex(
//     (product) => product.id === productId,
//   );
//
//   if (productIndex !== -1) {
//     products.splice(productIndex, 1);
//     await writeData(products, productPath);
//     console.log("Product deleted from products DB");
//
//     await removeProductFromAllCarts(productId);
//     console.log("Product deleted from carts DB");
//   } else {
//     console.log("Product dosen't exixst");
//   }
// }
// export async function addProduct(
//   artisanId,
//   name,
//   image,
//   oldPrice,
//   quantity,
//   description,
// ) {
//   artisanId = parseInt(artisanId);
//   oldPrice = parseFloat(oldPrice);
//   quantity = parseInt(quantity);
//   const products = await readData(productPath);
//
//   if (products.find((product) => product.name === name)) {
//     throw new Error("Product already exists");
//   }
//
//   const newProduct = {
//     id: Date.now(),
//     aid: artisanId,
//     name,
//     image,
//     oldPrice: parseFloat(oldPrice),
//     newPrice: Math.floor(parseFloat(oldPrice) - parseFloat(oldPrice) * 0.1),
//     quantity,
//     description,
//   };
//
//   products.push(newProduct);
//   await writeData(products, productPath);
//   console.log("Product added");
// }
