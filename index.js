const isObject = (object) => object instanceof Object;
const isFunction = (object) => object instanceof Function;
const isArray = (object) => Array.isArray(object);

const originSymbol = '__symbol_icopier_origin';
const setOrigin = (object, name, value) => {
    if (isObject(object)) {

        if (!object[originSymbol]) {
            Object.defineProperty(object, originSymbol, {
                value: {},
                configurable: false,
                enumerable: false
            });
        }

        object[originSymbol][name] = value;
    }
};

const getOrigin = (object, name) => {
    if (isObject(object)) {
        if (object[originSymbol]) {
            return object[originSymbol][name];
        } else {
            return object[name];
        }
    }
};


const _copy = (object, depth, options = {}, level = 0) => {
    if (depth !== null && level > depth) {
        return object;
    }

    if (isFunction(object)) {
        return object;
    }

    if (!isObject(object)) {
        return object;
    }

    let names = [];
    let result = null;

    if (isArray(object)) {
        names = [...Array(object.length).keys()];
        result = [];
    } else {
        names = Object.getOwnPropertyNames(object).filter((name) => name !== originSymbol);
        const Clone = function () {
        };

        Clone.prototype = object;
        result = new Clone();
    }

    for (let i = 0; i < names.length; i++) {
        let name = names[i];

        if (isObject(object[name])) {
            if (options.strict) {
                setOrigin(result, name, object[name]);
            }

            result[name] = _copy(object[name], depth, options, level + 1);
        } else {
            result[name] = object[name];
        }
    }

    return result;
};

const copy = (object, depth = null, options = {}) => {
    return _copy(object, depth, Object.assign({strict: true}, options))
};

const _isSame = (object1, object2, depth = null, options = {}, level = 0) => {
    if (depth !== null && level > depth) {
        return true;
    }

    let names = [];

    if (isArray(object1) && isArray(object2) && object1.length === object2.length) {
        names = [...Array(object1.length).keys()];
    } else if (isObject(object1) && isObject(object2)) {
        names = [...Object.getOwnPropertyNames(object1), ...Object.getOwnPropertyNames(object2)]
            .filter((name) => name !== originSymbol);

        names = [...new Set(names)];
    } else if (isFunction(object1) && isFunction(object2)) {
        if (options.strictFunction) {
            return object1 === object2;
        } else {
            return true;
        }
    } else {
        return object1 === object2;
    }

    for (let idx = 0; idx < names.length; idx++) {
        let name = names[idx];

        if (object1[name] !== object2[name]) {
            if (isObject(object1[name]) && isObject(object2[name])) {
                if (options.strictOrigin && getOrigin(object1, name) !== getOrigin(object2, name)) {
                    return false;
                }

                if (!_isSame(object1[name], object2[name], depth, options, level + 1)) {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    return true;
};

const isSame = (object1, object2, depth = null, options = {}) => {
    options = Object.assign({
        strictFunction: true,
        strictOrigin: true
    }, options);
    return _isSame(object1, object2, depth, options);
};

module.exports = {
    copy,
    isSame
};