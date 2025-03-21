// import module and test your functions inside the test function

import { bookWorkshop } from "./workshopmodel.js";

async function test() {
  const result = await bookWorkshop(
    "John Doe",
    "john@example.com",
    "1234567890",
    "Pottery Workshop",
    "Learn the basics of pottery making",
    "2025-04-15",
    "14:00-16:00"
  );
}
test();
