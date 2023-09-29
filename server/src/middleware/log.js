const log = require('../logging/log');

const logMiddleware = (req, res, next) => {
    try {
        if(!!Object.entries(req.body).length) log.info(`Params: ${JSON.stringify(req.body)}`);
    } catch (e) {
        // ignore
    }
    next();
}

module.exports = logMiddleware;