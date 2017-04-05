const isObject = (object) => object instanceof Object;
const isFunction = (object) => object instanceof Function;
const isArray = (object) => Array.isArray(object);
//TODO @@@slava do I need?
// const isPureObject = (object) => isObject(object) && !isFunction(object) && !isArray(object);

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
        names = Object.getOwnPropertyNames(object);
        const Clone = function () {
        };

        Clone.prototype = object;
        result = new Clone();
    }

    for (let i = 0; i < names.length; i++) {
        let name = names[i];

        if (isObject(object[name])) {
            //TODO @@@slava strict
            setOrigin(result, name, object[name]);
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

const isSame = (object1, object2, depth = null, options = {}) => {

};

module.exports = {
    copy,
    isSame
};