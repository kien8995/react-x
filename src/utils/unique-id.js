let currentId = 0;

export const uniqueId = (prefix = 'id') => {
    currentId++;
    return `${prefix}_${currentId}`;
};