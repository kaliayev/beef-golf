const prisma = require("../handlers/prismaClient");
const log = require("../logging/log");

const getAllCourses = async (req, res) => {
    const courses = await prisma.course.findMany({include: {hole: true}});
    res.status(200).json(courses);
}

const getCourseById = async (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = await prisma.course.findUnique({where: {id: courseId}, include: {hole: true}});
    res.status(200).json(course);
}

const getHoleById = async (req, res) => {
    const holeId = parseInt(req.params.id);
    const hole = await prisma.hole.findUnique({where: {id: holeId}});
    res.status(200).json(hole);
}

module.exports = {
    getAllCourses,
    getCourseById,
    getHoleById
}
