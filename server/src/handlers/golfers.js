const prisma = require("../handlers/prismaClient");

const getAllGolfers = async (req, res) => {
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
    res.status(200).json(golfers);
}
const getGolferById = async (req, res) => {
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
    res.status(200).json(golfer);
}

module.exports = {
    getAllGolfers,
    getGolferById
}