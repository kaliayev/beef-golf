import httpClient from "./httpClient";
const axios = httpClient();

export async function createStrokeLog(strokeLog) {
    let {round_id, golfer_id, hole_id, stroke_number} = strokeLog;
    let response = await axios.post(`/rounds/${round_id}/golfers/${golfer_id}/holes/${hole_id}/strokes/${stroke_number}/log`, strokeLog);
    return response.data;
}

export async function getGolferStrokes(round_id, golfer_id, hole_id) {
    let response = await axios.get(`/rounds/${round_id}/golfers/${golfer_id}/holes/${hole_id}/strokes`);
    return response.data;
}