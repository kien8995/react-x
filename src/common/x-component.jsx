import {Component} from 'react';
import * as PubSub from '../utils/pub-sub';

export default class XComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this._canUpdate = true;
        this._subjects = new Map();
    }

    subscribe = (subject, subscriber = this.safeUpdate) => {
        this._subjects.set(subject, subscriber);
        return PubSub.subscribe(subject, subscriber);
    };

    unsubscribe = (subject, subscriber = this.safeUpdate) => {
        PubSub.unsubscribe(subject, subscriber);
    };

    unsubscribeAll = () => {
        for (let [key, value] of this._subjects) {
            this.unsubscribe(key, value);
        }
    };

    setState = (newState) => {
        if (this._canUpdate) {
            super.setState(newState);
        }
    };

    safeUpdate = () => {
        if (this._canUpdate) {
            this.forceUpdate();
        }
    };

    componentWillUnmount = () => {
        this._canUpdate = false;
        this.unsubscribeAll();
    };
}