export const requireLength = (paramName) => {
    return (value) => {
        if (value.length && value.length > 3) {
            return true;
        }
        return `${paramName} needs to have at least few characters`;
    }
};