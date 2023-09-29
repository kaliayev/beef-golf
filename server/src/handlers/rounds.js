const prisma = require("../handlers/prismaClient");
const log = require("../logging/log");

const createRound = async (req, res) => {
    let date_created = req.body.date_created;
    const round = await prisma.round.create({
        data: {
            course_id: req.body.course_id,
            date_created,
            scoreCard: {
                create: req.body.golfers.map(golfer => {
                    return {
                        golfer_id: golfer.golfer_id,
                        beef_week: golfer.beef_week,
                        date_created: date_created,
                    }
                })
            }
        },
    });
    res.status(201).json(round);
}

const getRoundById = async (req, res) => {
    const roundId = parseInt(req.params.id);
    const round = await prisma.round.findUnique({
        where: {id: roundId},
        include: {
            course: {
                include: {
                    hole: true
                }
            },
            scoreCard: {
                include: {
                    golfer: {
                        include: {
                            golferClub: {
                                include: {
                                    club: true
                                }
                            }
                        }
                    },
                    scoreCardHole: true
                }
            }
        }
    });
    res.status(200).json(round);
}

const getRounds = async (req, res) => {
    const completedQuery = req.query.completed;
    let query = {};
    if (completedQuery === "true") {
        query.completed = true;
    } else if (completedQuery === "false") {
        query.completed = false;
    }

    const rounds = await prisma.round.findMany({
        where: query,
    });
    res.status(200).json(rounds);
}

module.exports = {
    createRound,
    getRounds,
    getRoundById
}
