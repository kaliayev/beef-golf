const log = require('../logging/log');
const errorHandlingMiddleware = (err, req, res, next) => {
    log.error(err);
    return res.status(500).send(err.message);
}

module.exports = errorHandlingMiddleware;