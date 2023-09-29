import httpClient from "./httpClient";
import Constants from "../constants";
const axios = httpClient();
export async function login(username, password) {
    let response = await axios.post(`/login`, {password});
    localStorage.setItem(Constants.authStorageKey, response.data.token);
    return response.data;
}

export async function logout() {
    localStorage.removeItem(Constants.authStorageKey);
    return {};
}