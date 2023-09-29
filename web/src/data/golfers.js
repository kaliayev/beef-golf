import httpClient from "./httpClient";
const axios = httpClient();

export async function getGolfers() {
    let response = await axios.get(`/golfers`);
    return response.data;
}