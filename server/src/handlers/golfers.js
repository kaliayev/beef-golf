const prisma = require("../handlers/prismaClient");
const log = require("../logging/log");

const getAllGolfers = async (req, res) => {
    try {
        const golfers = await prisma.golfer.findMany(
            {
                include: {
                    golferClub: {
                        include: {
                            club: true
                        }
                    }
                }
            });
        return res.status(200).json(golfers);
    } catch (e) {
        log.error(e)
        return res.status(500).json({message: e.message});
    }
}
const getGolferById = async (req, res) => {
    try {
        const golferId = parseInt(req.params.id);
        const golfer = await prisma.golfer.findUnique(
            {
                where: {id: golferId},
                include: {
                    golferClub: {
                        include: {
                            club: true
                        }
                    }
                }
            });
        return res.status(200).json(golfer);
    } catch (e) {
        log.error(e)
        return res.status(500).json({message: e.message});
    }
}

module.exports = {
    getAllGolfers,
    getGolferById
}