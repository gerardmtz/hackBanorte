// view the README.md file for additional instructions
const axios = require("axios");
const { cli } = require("cli-ux");

const API_KEY = "VF.DM.6473203ddacc180006503639.oO8dwMB5NF3elKAW"; // it should look like this: VF.DM.XXXXXXX.XXXXXX... keep this a secret!

// send an interaction to the Voiceflow API, and log the response, returns true if there is a next step
async function interact(userID, request) {
  console.log("...");

  // call the Voiceflow API with the user's name & request, get back a response
  const response = await axios({
    method: "POST",
    url: `https://general-runtime.voiceflow.com/state/user/${userID}/interact`,
    headers: { Authorization: API_KEY },
    data: { request },
  });

  // loop through the response
  for (const trace of response.data) {
    switch (trace.type) {
      case "text":
      case "speak": {
        console.log(trace.payload.message);
        break;
      }
      case "end": {
        // an end trace means the the Voiceflow dialog has ended
        return false;
      }
    }
  }

  return true;
}

async function main() {
  const userID = await cli.prompt("> ¿Cuál es tu nombre?");
  // send a simple launch request starting the dialog
  let isRunning = await interact(userID, { type: "launch" });

  while (isRunning) {
    const nextInput = await cli.prompt("> Mensaje: ");
    // send a simple text type request with the user input
    isRunning = await interact(userID, { type: "text", payload: nextInput });
  }
  console.log("The end! Start me again with `npm start`");
}

main();
