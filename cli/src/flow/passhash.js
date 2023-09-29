import bcryptjs from 'bcryptjs';
import {NUM_SALT_ROUNDS} from "../constants.js";

export const generatePasshash = (password) => bcryptjs.hashSync(password, NUM_SALT_ROUNDS);