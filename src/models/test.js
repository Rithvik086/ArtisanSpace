import { updateResponse, loadcustData } from "./customerresponse.js";
import { addUser } from "./usermodel.js";

async function test() {
  await addUser("daksh", "test@test", "pass", 9090909090, "admin");
}
test();
