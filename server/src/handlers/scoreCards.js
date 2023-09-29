const prisma = require("../handlers/prismaClient");

const createScoreCardHole = async (req, res) => {
    const round_id = parseInt(req.body.round_id);
    const golfer_id = parseInt(req.body.golfer_id);
    const hole_id = parseInt(req.params.hole_id);

    const scoreCardHole = await prisma.scoreCardHole.create({
        data: {
            round_id,
            golfer_id,
            hole_id,
            strokes: req.body.strokes,
            putts: req.body.putts,
            penalties: req.body.penalties,
            date_created: req.body.date_created,
        }
    });
    res.status(201).json(scoreCardHole);
}

module.exports = {
    createScoreCardHole
}