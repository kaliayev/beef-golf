import httpClient from "./httpClient";
const axios = httpClient();

export async function createRound(round) {
    let response = await axios.post(`/rounds`, round);
    return response.data;
}

export async function getRound(roundId) {
    let response = await axios.get(`/rounds/${roundId}`);
    return response.data;
}