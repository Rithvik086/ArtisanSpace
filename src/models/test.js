import { updateResponse, loadcustData } from "./customerresponse.js";


async function test(){
    await updateResponse();

    const data = await loadcustData("./customerresponse.json")
    console.log(data)
}
test();