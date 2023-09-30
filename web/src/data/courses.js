import {server} from "./httpClient";

export async function getCourses() {
    let response = await server.get(`/courses`);
    return response.data;
}

export async function getCourse(courseId) {
    let response = await server.get(`/courses/${courseId}`);
    return response.data;
}