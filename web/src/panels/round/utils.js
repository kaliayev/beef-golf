export function objCompare(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function sortArrayByPropDesc(array, prop) {
    if (!array) {
        return [];
    } else if (!prop) {
        return array;
    } else if (array.length === 0) {
        return array;
    }

    return array.sort((a, b) => (a[prop] < b[prop]) ? 1 : -1)
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}