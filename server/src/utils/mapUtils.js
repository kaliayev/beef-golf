const trimMap = (m) => Object.entries(m).reduce((acc, [k, v]) => {if(v != null || v != undefined) {acc[k] = v} return acc}, {})
const nullSafeMerge = (m1, m2) => Object.assign({}, m1, trimMap(m2));

module.exports = {
    trimMap,
    nullSafeMerge
}