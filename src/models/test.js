// import module and test your functions inside the test function

import { initializeDatabases } from "../config/sqlite.js";
import {
  acceptWorkshop,
  bookWorkshop,
  getAcceptedWorkshops,
  getAvailableWorkshops,
  getWorkshops,
  removeWorkshop,
} from "./workshopmodel.js";

await initializeDatabases();

async function test() {
  // console.log(
  //   await bookWorkshop(
  //     "777b1dbc-58f3-41a4-9b7f-ccb4064d60e5",
  //     "test title",
  //     "test desc",
  //     "today",
  //     "idk"
  //   )
  // );
  console.log(await getAvailableWorkshops());
  // console.log(await getAcceptedWorkshops());
  // console.log(await acceptWorkshop("05e3aa7c-be5e-4848-b096-b7cc3a88c999"));
  // console.log(await removeWorkshop("938812c9-35aa-4b0c-98c8-acec3586bbad"));
}
await test();
