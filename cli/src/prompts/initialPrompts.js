import {UPLOAD_SCORE, PASSHASH} from "../constants.js";

export const initialPrompt = [
    {
        type: "list",
        name: "task",
        message: "Select a task",
        choices: [UPLOAD_SCORE, PASSHASH]
    }];