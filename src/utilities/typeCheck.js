function isFunction(obj) {
    return typeof obj === 'function';
}

function isObject(obj) {
    return obj instanceof Object && obj.constructor === Object;
}

module.exports = {
    isFunction,
    isObject,
};
