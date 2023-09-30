import {server} from "./httpClient";

export async function getGolfers() {
    let response = await server.get(`/golfers`);
    return response.data;
}