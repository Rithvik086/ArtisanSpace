import fs from "fs/promises";
const productPath = "./products.json";

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

export async function addProduct(name, image, oldPrice, quantity) {
  const products = await readData(productPath);

  if (products.find((product) => product.name === name)) {
    throw new Error("Product already exists");
  }

  const newProduct = {
    id: Date.now(),
    name,
    image,
    oldPrice: parseFloat(oldPrice),
    newPrice: Math.floor(parseFloat(oldPrice) - parseFloat(oldPrice) * 0.1),
    quantity,
  };

  products.push(newProduct);
  await writeData(products, produstPath);
  console.log("Product added");
}

export async function getProducts() {
  return await readData(productPath);
}
