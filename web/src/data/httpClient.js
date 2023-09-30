import axios from "axios";

import Constants from "../constants";

export default function httpClient() {
    return axios.create({
        baseURL: Constants.server,
    })
}

export const server = httpClient();



export async function login(password) {
    let response = await server.post(`/login`, {password});
    localStorage.setItem(Constants.authStorageKey, response.data.token);
    server.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    return response.data;
}

export async function logout() {
    localStorage.removeItem(Constants.authStorageKey);
    server.defaults.headers.common['Authorization'] = null;
    return {};
}