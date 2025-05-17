import fs from "fs/promises";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const custrespath = path.resolve(__dirname, "../../customerresponse.json");

const csv_url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSY5h_WGkN_AyNRZUJtYYU1C8MByLyUoAqBDPToqo5U3u_VWpV0mI9dQD5Nm1SqkK3b2V5R-bReef9h/pub?output=csv";
const json_file = "custresponse.json";

async function ensureFileExists(filePath) {
  if (!filePath) {
    throw new Error("File path is undefined!");
  }
  try {
    await fs.access(filePath);
  } catch {
    console.log(`Creating file: ${filePath}`);
    await fs.writeFile(filePath, "[]");
  }
}

async function loadcustData(filePath) {
  await ensureFileExists(filePath);
  try {
    const fileData = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("error loading cust responses");
    return [];
  }
}

async function fetchcustData() {
  try {
    const response = await fetch(csv_url);
    const csvtext = await response.text();

    // console.log("📥 Fetched CSV Data:\n", csvtext); // Debug log

    const rows = csvtext
      .trim()
      .split("\n")
      .map((row) => row.split(","));

    // Fix: Remove '\r' from headers
    const headers = rows[0].map((h) => h.trim().replace(/\r$/, ""));
    const data = rows
      .slice(1)
      .map((row) =>
        Object.fromEntries(
          row.map((value, index) => [headers[index], value.trim()])
        )
      );

    // console.log("📝 Parsed JSON Data:\n", data); // Debug log

    return data;
  } catch (error) {
    console.error(" Error fetching data", error);
    return [];
  }
}

async function updateResponse() {
  const alreadydata = await loadcustData(custrespath);
  const latestdata = await fetchcustData();
  // console.log("📂 Existing Data in JSON:\n", alreadydata);
  // console.log("📥 Latest Fetched Data:\n", latestdata);

  // Better filtering that excludes empty responses
  const alreadyid = new Set(alreadydata.map((entry) => entry.email));
  let filterdData = latestdata.filter(
    (entry) =>
      // Check if email exists and is not empty
      entry.email &&
      entry.email.trim() !== "" &&
      // Check if it's not a duplicate
      !alreadyid.has(entry.email) &&
      // Optional: validate other required fields
      entry.fullName &&
      entry.fullName.trim() !== "" &&
      entry.message &&
      entry.message.trim() !== ""
  );

  // console.log("🧐 New Entries:\n", filterdData);

  if (filterdData.length > 0) {
    const updateddata = [...alreadydata, ...filterdData];
    await fs.writeFile(custrespath, JSON.stringify(updateddata, null, 2));
  }
}

updateResponse();

export { updateResponse, loadcustData };
