import {publish} from '../utils/pub-sub';
import * as persistentStorage from '../utils/persistent-storage';

export default class Store {
    _initialState = null;
    _state = null;
    _persistentKey = null;
    _expiry = null;

    constructor(state, persistentKey = null, expiry = null) {
        this._initialState = this._copyState(state);
        this._state = persistentStorage.tryGetItem(persistentKey, this._copyState(state));
        this._persistentKey = persistentKey;
        this._expiry = expiry;
    }

    _copyState = (state) => {
        return Object.assign({}, state);
    };

    _isCircular = (obj) => {
        try {
            JSON.stringify(obj);
        } catch (e) {
            return true;
        }
        return false;
    };

    _isEquals = (property1, property2) => {
        if (property1 === null && property1 !== property2) {
            return false;
        } else if (property1 === null && property1 === property2) {
            return true;
        } else {
            if (property1 && property1.constructor) {
                switch (property1.constructor) {
                    case Array:
                    case Object:
                    case Function: {
                        if (this._isCircular(property1) || this._isCircular(property2)) {
                            return false;
                        } else {
                            return JSON.stringify(property1) === JSON.stringify(property2);
                        }
                    }
                    case Number:
                    case String:
                    case Boolean:
                    default: {
                        return property1 === property2;
                    }
                }
            } else {
                return property1 === property2;
            }
        }
    };

    getState = () => {
        return this._state;
    };

    setState = (newState) => {
        let updated = false;

        for (let property in newState) {
            if (newState.hasOwnProperty(property) && this._state.hasOwnProperty(property)) {
                if (!this._isEquals(this._state[property], newState[property])) {
                    this._state[property] = newState[property];
                    updated = true;
                }
            }
        }

        if (updated) {
            publish(this, newState);
            if (this._persistentKey) {
                persistentStorage.setItem(this._persistentKey, newState, this._expiry);
            }
        }
    };

    resetState = () => {
        this.setState(this._initialState);
        if (this._persistentKey) {
            persistentStorage.removeItem(this._persistentKey);
        }
    };
}