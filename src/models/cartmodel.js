import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { getUsers } from "./usermodel.js";
import { productCount } from "./productmodel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartPath = path.join(__dirname, "../../carts.json");

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

export async function getCart(userId) {
  userId = parseInt(userId);
  const carts = await readData(cartPath);

  let userCart = carts.find((cart) => cart.userId === userId);
  if (userCart) {
    return userCart;
  } else {
    return { userId, cart: [] };
  }
}

export async function getCartProductQuantity(userId, productId) {
  userId = parseInt(userId);
  productId = parseInt(productId);
  const cart = await getCart(userId);
  if (cart.cart.length > 0) {
    const product = cart.cart.find(
      (product) => product.productId === productId
    );
    if (product) {
      return product.quantity;
    }
  }
  return 0;
}

export async function addItem(userId, productId) {
  userId = parseInt(userId);
  productId = parseInt(productId);
  const carts = await readData(cartPath);
  const produtQuantity = await productCount(productId);
  const cartQuantity = await getCartProductQuantity(userId, productId);

  if (produtQuantity > cartQuantity) {
    let userCart = carts.find((cart) => cart.userId === userId);

    if (userCart) {
      let product = userCart.cart.find((item) => item.productId === productId);

      if (product) {
        product.quantity += 1;
      } else {
        userCart.cart.push({ productId, quantity: 1 });
      }
    } else {
      carts.push({ userId, cart: [{ productId, quantity: 1 }] });
    }

    await writeData(carts, cartPath);
    console.log("Product added to cart");
  } else {
    console.log("No more product in inventory");
  }
}

export async function deleteItem(userId, productId) {
  userId = parseInt(userId);
  productId = parseInt(productId);
  const carts = await readData(cartPath);

  let userCart = carts.find((cart) => cart.userId === userId);

  if (userCart) {
    let productIndex = userCart.cart.findIndex(
      (item) => item.productId === productId
    );

    if (productIndex !== -1) {
      let product = userCart.cart[productIndex];

      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        userCart.cart.splice(productIndex, 1);
      }

      if (userCart.cart.length === 0) {
        let userIndex = carts.findIndex((cart) => cart.userId === userId);
        carts.splice(userIndex, 1);
      }
    }
  }
  await writeData(carts, cartPath);
  console.log("Product deleted from cart");
}

export async function removeCompleteItem(userId, productId) {
  userId = parseInt(userId);
  productId = parseInt(productId);
  const carts = await readData(cartPath);

  let userCart = carts.find((cart) => cart.userId === userId);

  if (userCart) {
    if (userCart.cart.length > 1) {
      let productIndex = userCart.cart.findIndex(
        (item) => item.productId === productId
      );
      userCart.cart.splice(productIndex, 1);
    } else {
      let cartIndex = carts.findIndex((cart) => cart.userId === userId);
      carts.splice(cartIndex, 1);
    }
  }
  await writeData(carts, cartPath);
  console.log("Product completely deleted");
}

export async function removeProductFromAllCarts(productId) {
  productId = parseInt(productId);
  const users = await getUsers();

  for (let user of users) {
    await removeCompleteItem(user.id, productId);
  }
}

export async function removeCart(userId) {
  userId = parseInt(userId);
  const carts = await readData(cartPath);

  const cartIndex = carts.findIndex((cart) => cart.userId === userId);

  if (cartIndex !== -1) {
    carts.splice(cartIndex, 1);
    await writeData(carts, cartPath);
  } else {
    console.log("Cart not found in DB");
  }
}
