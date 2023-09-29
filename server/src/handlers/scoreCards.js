const prisma = require("../handlers/prismaClient");
const log = require("../logging/log");

const createScoreCardHole = async (req, res) => {
    try {
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
        return res.status(201).json(scoreCardHole);
    } catch (e) {
        log.error(e)
        return res.status(500).json({message: e.message});
    }
}

module.exports = {
    createScoreCardHole
}