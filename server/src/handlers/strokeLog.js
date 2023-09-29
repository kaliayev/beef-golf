const prisma = require("../handlers/prismaClient");

const createStrokeLog = async (req, res) => {
    const date_created = req.body.date_created;
    const round_id = parseInt(req.params.round_id);
    const golfer_id = parseInt(req.params.golfer_id);
    const hole_id = parseInt(req.params.hole_id);
    const stroke_number = parseInt(req.params.stroke_number);
    const strokeLog = await prisma.strokeLog.create({
        data: {
            round_id,
            golfer_id,
            hole_id,
            stroke_number,
            date_created,
            club_id: req.body.club_id,
            distance: req.body.distance,
            make: req.body.make,
            max_strokes_pickup: req.body.max_strokes_pickup,
            penalty_stroke: req.body.penalty_stroke,
            direction: req.body.direction,
            geoLocation: {
                create:
                    req.body.geoLocations.map(geoLocation => {
                        return {
                            latitude: geoLocation.latitude,
                            longitude: geoLocation.longitude,
                            accuracy: geoLocation.accuracy,
                            altitude: geoLocation.altitude,
                            altitude_accuracy: geoLocation.altitude_accuracy,
                            date_created: date_created,
                        }
                    })
                }
        }
    })
    return res.status(201).json(strokeLog);
}

module.exports = {
    createStrokeLog
}