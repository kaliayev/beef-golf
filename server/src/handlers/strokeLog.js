const prisma = require("../handlers/prismaClient");

const createStrokeLog = async (req, res) => {
    const date_created = req.body.date_created;
    const round_id = parseInt(req.params.round_id);
    const golfer_id = parseInt(req.params.golfer_id);
    const hole_id = parseInt(req.params.hole_id);
    const stroke_number = parseInt(req.params.stroke_number);
    const connectors = {
    round: {
        connect: {
            id: round_id
        }
    },
    golfer: {
        connect: {
            id: golfer_id
        }
    },
    hole: {
        connect: {
            id: hole_id
        }
    },
    scoreCard: {
        connect: {
            round_id_golfer_id: {
                round_id,
                    golfer_id
            }
        }
    }}
    const strokeLog = await prisma.strokeLog.create({
        data: {
            ...connectors,
            stroke_number,
            date_created,
            distance: req.body.distance,
            green: req.body.green,
            pickup: req.body.pickup,
            penalty: req.body.penalty,
            direction: req.body.direction,
            club: {
                connect: {
                    id: req.body.club_id
                }
            },
            golferClub: {
                connect: {
                    golfer_id_club_id: {
                        golfer_id,
                        club_id: req.body.club_id
                    }
                }
            },
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
                            ...connectors
                        }
                    })
                }
        }
    })
    return res.status(201).json(strokeLog);
}

const getStrokes = async (req, res) => {
    const round_id = parseInt(req.params.round_id);
    const golfer_id = parseInt(req.params.golfer_id);
    const hole_id = parseInt(req.params.hole_id);
    const strokes = await prisma.strokeLog.findMany({
        where: {
            round_id,
            golfer_id,
            hole_id
        },
        orderBy: {
            stroke_number: 'asc'
        },
        include: {
            geoLocation: {
                orderBy: {
                    date_created: 'asc'
                }
            }
        }
    })
    return res.status(200).json(strokes);
}
module.exports = {
    createStrokeLog,
    getStrokes
}