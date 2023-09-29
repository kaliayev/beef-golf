#! /usr/bin/env node
import figlet from 'figlet';
//import axios from "axios";
import inquirer from 'inquirer';
//import {getTokenFromCache} from "./src/domain/token.js";
import {passprompt} from "./src/prompts/login.js";
import {initialPrompt} from "./src/prompts/initialPrompts.js";
import {UPLOAD_SCORE, PASSHASH} from "./src/constants.js";
import {generatePasshash} from "./src/flow/passhash.js";


const title = "BeefGolf CLI"
console.log(figlet.textSync(title, { horizontalLayout: "full" }));

await inquirer
    .prompt(initialPrompt) // task
    .then(async (answers) => {
        if(answers.task === UPLOAD_SCORE) {
            throw new Error("Not implemented");
        } else if (answers.task === PASSHASH) {
            await inquirer.prompt(passprompt)
                .then(async (answers) => console.log(generatePasshash(answers.password)));
        }
    });
