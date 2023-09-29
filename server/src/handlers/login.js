const {sign} = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const log = require("../logging/log");
const {parsed: config } = require("dotenv").config();
const passhash =  config.LOGIN_PASS_HASH;

const login = (req, res) => {
    let {password} = req.body;
    log.info(`login attempt with password ${password}`)
    let {extendedToken} = req.query;
    try {
        if (bcrypt.compareSync(password, passhash)) {
            let options = {expiresIn: '48h'};
            if (extendedToken) options.expiresIn = '4 weeks';
            return res.status(200).json({token: sign({beefin: "ain't ez"}, config.JWT_SECRET, options)});
        } else {
            log.error("Login failure", err)
            return res.status(403).json({message: "Unauthorized"});
        }
    } catch (e) {
        return res.status(403).json({message: "Unauthorized"});
    }
}

module.exports = login;