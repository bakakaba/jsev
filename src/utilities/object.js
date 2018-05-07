function getPropertyByNameIgnoreCase(obj, name) {
    const nName = name.toLocaleLowerCase();
    const key = Object.keys(obj)
        .find((x) => x.toLocaleLowerCase() === nName);

    return key ? obj[key] : undefined; // eslint-disable-line no-undefined
}

module.exports = {
    getPropertyByNameIgnoreCase,
};
