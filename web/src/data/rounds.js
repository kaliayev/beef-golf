import {server} from "./httpClient";

export async function createRound(round) {
    let response = await server.post(`/rounds`, round);
    return response.data;
}

export async function getRound(roundId) {
    let response = await server.get(`/rounds/${roundId}`);
    return response.data;
}

export async function getRounds() {
    let response = await server.get(`/rounds`);
    return response.data;
}