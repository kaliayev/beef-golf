import axios from "axios";

import Constants from "../constants";

export default function httpClient() {
    return axios.create({
        baseURL: Constants.server,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem(Constants.authStorageKey)}`,
        }
    })
}
