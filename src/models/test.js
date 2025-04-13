// import module and test your functions inside the test function

import { removeCart } from "../services/cartServices.js";
import dbConnect from "../config/dbconnect.js";
import { placeOrder } from "../services/orderServices.js";
import { decreaseProductQuantity } from "../services/productServices.js";

async function test() {
  await dbConnect();
  await decreaseProductQuantity("67fa7092b0db96c6bac28e20", 120);
  // removeCart("67fa4eca7e9ae6a6860f7134");
  // await placeOrder("67fa4eca7e9ae6a6860f7134", 1200);
  //  addRequest("b8e1160f-1245-4f19-8c11-1ea3b1a7b3d8","phela request","kuch toh hai","img","phela order hai ji","1200","12:35:30");
  //  addRequest("b8e1160f-1245-4f19-8c11-1ea3b1a7b3d8","dusra request","kuch toh hai","img","phela order hai ji","1200","12:35:30");
  // approveRequest("10d02a96-6068-4cd3-bae7-b423a526fd61","b8e1160f-1245-4f19-8c11-1ea3b1a7b3d8");
}
await test();

console.log("done");
