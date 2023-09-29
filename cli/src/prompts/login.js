import {requireLength} from "./validators.js";

export const passprompt = [
    {
        type: 'password',
        message: 'Enter a password',
        name: 'password',
        mask: "*",
        validate: requireLength("password"),
    },
];