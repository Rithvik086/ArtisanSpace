import db from "../config/sqlite.js";
import { productCount } from "./productmodel.js";

db.run(
  `create table if not exists cart(userId integer not null, productId integer not null, quantity integer not null, primary key(userId, productId))`,
  (err) => {
    if (err) {
      console.log("Cart table error", err.message);
    }
  },
);

export function getCart(userId) {
  return new Promise((resolve, reject) => {
    userId = parseInt(userId);

    db.all(
      "select productId, quantity from cart where userId = ?",
      [userId],
      (err, rows) => {
        if (err) {
          console.log("Fetch cart error:", err.message);
          return reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
}

export function getCartProductQuantity(userId, productId) {
  return new Promise((resolve, reject) => {
    userId = parseInt(userId);
    productId = parseInt(productId);

    db.get(
      "select quantity from cart where userId=? and productId=?",
      [userId, productId],
      (err, rows) => {
        if (err) {
          console.log("Fetch product quantity error:", err.message);
          return reject(err);
        } else {
          resolve(rows ? rows.quantity : 0);
        }
      },
    );
  });
}

export async function addItem(userId, productId) {
  userId = parseInt(userId);
  productId = parseInt(productId);

  const productQuantity = await productCount(productId);
  const cartQuantity = await getCartProductQuantity(userId, productId);

  if (productQuantity > cartQuantity) {
    if (cartQuantity) {
      await new Promise((resolve, reject) => {
        db.run(
          "update cart set quantity = quantity +1 where userId = ? and productId = ?",
          [userId, productId],
          (err) => {
            if (err) {
              console.error("Error updating the quantity: ", err.message);
              return reject(err);
            } else {
              resolve();
            }
          },
        );
      });
      return {success:true};
    } else {
      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO cart (userId, productId, quantity) values (?, ?, ?)",
          [userId, productId, 1],
          (err) => {
            if (err) {
              console.error("Error inserting product:", err.message);
              return reject(err);
            } else {
              resolve();
            }
          },
        );
      });
    }
    return {success:true};
  } else {
    return {success:false, message:"Stock limit reached"};
  }
}

export async function deleteItem(userId, productId) {
  userId = parseInt(userId);
  productId = parseInt(productId);

  const userProductCount = await getCartProductQuantity(userId, productId);

  if (userProductCount > 1) {
    await new Promise((resolve, reject) => {
      db.run(
        "update cart set quantity = quantity - 1 where userId =? and productId = ?",
        [userId, productId],
        (err) => {
          if (err) {
            console.error("Error updating the cart", err.message);
            return reject(err);
          } else {
            resolve();
          }
        },
      );
    });
    return "Product quantity updated successfully.";
  } else {
    await new Promise((resolve, reject) => {
      db.run(
        "delete from cart where userId =? and productId =?",
        [userId, productId],
        (err) => {
          if (err) {
            console.error("Error deleting cart.", err.message);
            return reject(err);
          } else {
            resolve();
          }
        },
      );
    });
    return "Cart deleted successfully.";
  }
}

export async function removeCompleteItem(userId, productId) {
  userId = parseInt(userId);
  productId = parseInt(productId);

  await new Promise((resolve, reject) => {
    db.run(
      "delete from cart where userId=? and productId =?",
      [userId, productId],
      (err) => {
        if (err) {
          console.error("Error deleting Product.", err.message);
          return reject(err);
        } else {
          resolve();
        }
      },
    );
  });
  return "Item deleted completely.";
}

export async function removeCart(userId) {
  userId = parseInt(userId);

  await new Promise((resolve, reject) => {
    db.run("delete from cart where userId = ?", [userId], (err) => {
      if (err) {
        console.error("Error deleting cart.", err.message);
        return reject(err);
      } else {
        resolve();
      }
    });
  });
  return "Cart deleted successfully";
}

export async function removeProductFromAllCarts(productId) {
  productId = parseInt(productId);

  await new Promise((resolve, reject) => {
    db.run("delete from cart where productId = ?", [productId], (err) => {
      if (err) {
        console.error("Error deleting Product.", err.message);
        return reject(err);
      } else {
        resolve();
      }
    });
  });
  return "All Products deleted successfully.";
}

// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import path from "path";
// import { getUsers } from "./usermodel.js";
// import { productCount } from "./productmodel.js";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// const cartPath = path.join(__dirname, "../../carts.json");
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
//
//
// async function writeData(data, filePath) {
//   await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }
//
// export async function getCart(userId) {
//   userId = parseInt(userId);
//   const carts = await readData(cartPath);
//
//   let userCart = carts.find((cart) => cart.userId === userId);
//   if (userCart) {
//     return userCart;
//   } else {
//     return { userId, cart: [] };
//   }
// }
//
// export async function getCartProductQuantity(userId, productId) {
//   userId = parseInt(userId);
//   productId = parseInt(productId);
//   const cart = await getCart(userId);
//   if (cart.length > 0) {
//     const product = cart.find(
//       (product) => product.productId === productId
//     );
//     if (product) {
//       return product.quantity;
//     }
//   }
//   return 0;
// }
//
//
// export async function addItem(userId, productId) {
//   userId = parseInt(userId);
//   productId = parseInt(productId);
//   const carts = await readData(cartPath);
//   const produtQuantity = await productCount(productId);
//   const cartQuantity = await getCartProductQuantity(userId, productId);
//
//   if (produtQuantity > cartQuantity) {
//     let userCart = carts.find((cart) => cart.userId === userId);
//
//     if (userCart) {
//       let product = userCart.cart.find((item) => item.productId === productId);
//
//       if (product) {
//         product.quantity += 1;
//       } else {
//         userCart.cart.push({ productId, quantity: 1 });
//       }
//     } else {
//       carts.push({ userId, cart: [{ productId, quantity: 1 }] });
//     }
//
//     await writeData(carts, cartPath);
//     console.log("Product added to cart");
//   } else {
//     console.log("No more product in inventory");
//   }
// }
//
// export async function deleteItem(userId, productId) {
//   userId = parseInt(userId);
//   productId = parseInt(productId);
//   const carts = await readData(cartPath);
//
//   let userCart = carts.find((cart) => cart.userId === userId);
//
//   if (userCart) {
//     let productIndex = userCart.cart.findIndex(
//       (item) => item.productId === productId,
//     );
//
//     if (productIndex !== -1) {
//       let product = userCart.cart[productIndex];
//
//       if (product.quantity > 1) {
//         product.quantity -= 1;
//       } else {
//         userCart.cart.splice(productIndex, 1);
//       }
//
//       if (userCart.cart.length === 0) {
//         let userIndex = carts.findIndex((cart) => cart.userId === userId);
//         carts.splice(userIndex, 1);
//       }
//     }
//   }
//   await writeData(carts, cartPath);
//   console.log("Product deleted from cart");
// }
//
// export async function removeCompleteItem(userId, productId) {
//   userId = parseInt(userId);
//   productId = parseInt(productId);
//   const carts = await readData(cartPath);
//
//   let userCart = carts.find((cart) => cart.userId === userId);
//
//   if (userCart) {
//     if (userCart.cart.length > 1) {
//       let productIndex = userCart.cart.findIndex(
//         (item) => item.productId === productId
//       );
//       userCart.cart.splice(productIndex, 1);
//     } else {
//       let cartIndex = carts.findIndex((cart) => cart.userId === userId);
//       carts.splice(cartIndex, 1);
//     }
//   }
//   await writeData(carts, cartPath);
//   console.log("Product completely deleted");
// }
//
// export async function removeProductFromAllCarts(productId) {
//   productId = parseInt(productId);
//   const users = await getUsers();
//
//   for (let user of users) {
//     await removeCompleteItem(user.id, productId);
//   }
// }
//
// export async function removeCart(userId) {
//   userId = parseInt(userId);
//   const carts = await readData(cartPath);
//
//   const cartIndex = carts.findIndex((cart) => cart.userId === userId);
//
//   if (cartIndex !== -1) {
//     carts.splice(cartIndex, 1);
//     await writeData(carts, cartPath);
//   } else {
//     console.log("Cart not found in DB");
//   }
// }
