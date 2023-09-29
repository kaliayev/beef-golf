const express = require('express');
const cors = require('cors');
const json_parser = require("body-parser").json();
const errorResponseMiddleware = require("./src/middleware/error");
const dateMiddleware = require("./src/middleware/dateBody");
const logMiddleware = require("./src/middleware/log");
const authMiddleware = require("./src/middleware/auth");
const login = require("./src/handlers/login");
const {getAllCourses, getCourseById, getHoleById} = require("./src/handlers/courses");
const {getAllGolfers, getGolferById} = require("./src/handlers/golfers");
const {createRound, getRounds, getRoundById} = require("./src/handlers/rounds");
const {createScoreCardHole} = require("./src/handlers/scoreCards");
const {createStrokeLog, getStrokes} = require("./src/handlers/strokeLog");

const log = require('./src/logging/log');
const constants = require("./constants");

const app = express();
const port = constants.port;

app.use(cors({origin: '*'}), json_parser, dateMiddleware, logMiddleware)

app.use(errorResponseMiddleware);
app.use(express.static('public'));
app.post('/v1/login', login);

// auth after static files and login
app.use(authMiddleware);
// app endpoints
// course detail
app.get('/v1/courses', getAllCourses); // include holes data
app.get('/v1/courses/:id', getCourseById);
app.get('/v1/holes/:id', getHoleById);
// golfer detail
app.get('/v1/golfers', getAllGolfers);
app.get('/v1/golfers/:id', getGolferById);
// round detail
app.get('/v1/rounds', getRounds);
app.post('/v1/rounds', createRound);
app.get('/v1/rounds/:id', getRoundById);
// scorecard detail
app.post('/v1/rounds/:round_id/golfers/:golfer_id/holes/:hole_id/score', createScoreCardHole);
// stroke log detail
app.post('/v1/rounds/:round_id/golfers/:golfer_id/holes/:hole_id/strokes/:stroke_number/log', createStrokeLog);
app.get('/v1/rounds/:round_id/golfers/:golfer_id/holes/:hole_id/strokes', getStrokes);
app.listen(port, () => {
    log.info(`Server listening on port ${port}`);
});