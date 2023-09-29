import httpClient from "./httpClient";
const axios = httpClient();

export async function getCourses() {
    let response = await axios.get(`/courses`);
    return response.data;
}

export async function getCourse(courseId) {
    let response = await axios.get(`/courses/${courseId}`);
    return response.data;
}