import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname);
const tokenpath = `${__dirname}/tokencache.json`;

export function writeCacheTokenOrExit(token) {
    fs.writeFile(tokenpath, JSON.stringify({token}), (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    });
}

export function getTokenFromCache() {
    return JSON.parse(fs.readFileSync(tokenpath, 'utf8'));
}