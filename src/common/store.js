import {publish} from '../utils/pub-sub';

export default class Store {
    _initialState = null;
    state = null;

    constructor(state) {
        this._initialState = this._copyState(state);
        this.state = this._copyState(state);
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
        return this.state;
    };

    setState = (newState) => {
        let updated = false;

        for (let property in newState) {
            if (newState.hasOwnProperty(property) && this.state.hasOwnProperty(property)) {
                if (!this._isEquals(this.state[property], newState[property])) {
                    this.state[property] = newState[property];
                    updated = true;
                }
            }
        }

        if (updated) {
            publish(this, newState);
        }
    };

    resetState = () => {
        this.setState(this._initialState);
    };
}