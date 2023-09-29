const prisma = require("../handlers/prismaClient");
const log = require("../logging/log");

const getAllCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({include: {hole: true}});
        return res.status(200).json(courses);
    } catch (e) {
        log.error(e);
        return res.status(500).json({message: e.message});
    }
}

const getCourseById = async (req, res) => {
    try {
        const courseId = parseInt(req.params.id);
        const course = await prisma.course.findUnique({where: {id: courseId}, include: {hole: true}});
        return res.status(200).json(course);
    } catch (e) {
        log.error(e)
        return res.status(500).json({message: e.message});
    }
}

const getHoleById = async (req, res) => {
    try {
        const holeId = parseInt(req.params.id);
        const hole = await prisma.hole.findUnique({where: {id: holeId}});
        return res.status(200).json(hole);
    }catch (e) {
        log.error(e)
        return res.status(500).json({message: e.message});
    }
}

module.exports = {
    getAllCourses,
    getCourseById,
    getHoleById
}
