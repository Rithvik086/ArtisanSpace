import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { removeProductFromAllCarts } from "./cartmodel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productPath = path.join(__dirname, "../../products.json");

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

export async function addProduct(
  artisanId,
  name,
  image,
  oldPrice,
  quantity,
  description
) {
  artisanId = parseInt(artisanId);
  oldPrice = parseFloat(oldPrice);
  quantity = parseInt(quantity);
  const products = await readData(productPath);

  if (products.find((product) => product.name === name)) {
    throw new Error("Product already exists");
  }

  const newProduct = {
    id: Date.now(),
    aid: artisanId,
    name,
    image,
    oldPrice: parseFloat(oldPrice),
    newPrice: Math.floor(parseFloat(oldPrice) - parseFloat(oldPrice) * 0.1),
    quantity,
    description,
  };

  products.push(newProduct);
  await writeData(products, productPath);
  console.log("Product added");
}

export async function delProduct(productId) {
  productId = parseInt(productId);
  const products = await readData(productPath);

  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    await writeData(products, productPath);
    console.log("Product deleted from products DB");

    await removeProductFromAllCarts(productId);
    console.log("Product deleted from carts DB");
  } else {
    console.log("Product dosen't exixst");
  }
}

export async function getProducts() {
  return await readData(productPath);
}

export async function removeUserProduct(userId) {
  userId = parseInt(userId);
  const products = await readData(productPath);

  for (let product of products) {
    if (product.aID === userId) {
      await delProduct(product.id);
    }
  }
}

export async function productCount(productId) {
  productId = parseInt(productId);
  const products = await readData(productPath);

  const product = products.find((product) => product.id === productId);
  return product.quantity;
}
