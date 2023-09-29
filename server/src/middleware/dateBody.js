const {nullSafeMerge} = require('../utils/mapUtils');
const dateMiddleware = (req, res, next) => {
    let body = req.body;
    let date_now = (new Date()).toISOString();
    let date_updated = date_now;
    if (req.method === 'PUT') {
        body = nullSafeMerge(body, {date_updated});
    } else if (req.method === 'POST') {
        body = nullSafeMerge(body, {date_created: date_now, date_updated});
    }
    req.body = body;
    next();
}

module.exports = dateMiddleware;