import dbConnect from "./src/config/dbconnect.js";
import { placeOrder } from "./src/services/orderServices.js";

async function testPlaceOrder() {
  await dbConnect();
  await placeOrder("67fa4eca7e9ae6a6860f7134");
  console.log("Order placed successfully");
}

await testPlaceOrder();
