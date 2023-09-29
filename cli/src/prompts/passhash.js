import {requireLength} from "./validators.js";
export const todoprompts = [
    {
        type: "list",
        name: "context",
        message: "Select a context",
        choices: ["Home", "Work"],
    },
    {
        type: "input",
        name: "title",
        message: "Enter a title for your todo",
        validate: requireLength("todoTitle"),
    }
]