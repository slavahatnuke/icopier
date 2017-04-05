class Value {
    constructor(value = undefined) {
        this.value = value;
    }

    get() {
        return this.value;
    }

    set(value) {
        this.value = value;
    }
}

class Copier {
    constructor(depth = null, options = {}) {
        this.options = Object.assign({strict: true}, options);
        this.depth = depth;
    }

    copy(object) {
        return copy(object, this.depth, this.options);
    }

    isSame(object1, object2) {
        return isSame(object1, object2, this.depth, this.options);
    }
}

const copier = (depth = null, options = {}) => new Copier(depth, options);

const isObject = (object) => object instanceof Object;
const isFunction = (object) => object instanceof Function;
const isArray = (object) => Array.isArray(object);
//TODO @@@slava do I need?
const isPureObject = (object) => isObject(object) && !isFunction(object) && !isArray(object);


const field = (object, name, getter = () => undefined) => {
    if (isObject(object) && !object[name]) {
        Object.defineProperty(object, name, {
            get: getter,
            enumerable: false,
            configurable: false
        });
    }

    return object;
};

const originSymbol = '__symbol_icopier_origin';
const getOriginName = (name) => `${originSymbol}:${name}`;

const setOrigin = (object, name, value) => {
    if (isObject(object) && !object[getOriginName(name)]) {
        const _value = new Value(value);
        field(object, getOriginName(name), () => _value)
    }
};

const getOrigin = (object, name) => {
    if (isObject(object)) {
        if (object[getOriginName(name)]) {
            return object[getOriginName(name)].get();
        } else {
            return object[name];
        }
    } else {
        return undefined;
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
    isSame,
    copier
};