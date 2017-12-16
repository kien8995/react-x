import React, {Component} from 'react';
import * as PubSub from '../utils/pub-sub';

export default class XComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this._canUpdate = true;
        this._subscribers = new Map();
        this.onUnmounts = [];
        this.onMounts = [];
    }

    publish = (subject, value) => {
        PubSub.publish(subject, value);
    };

    subscribe = (subject, subscriber = this.safeUpdate) => {
        this._subscribers.set(subject, subscriber);
        return PubSub.subscribe(subject, subscriber);
    };

    unsubscribe = (subject, subscriber = this.safeUpdate) => {
        PubSub.unsubscribe(subject, subscriber);
    };

    unsubscribeAll = () => {
        for (let [key, value] of this._subscribers) {
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

    onMount = (f) => {
        this.onMounts.push(f);
    };

    onUnmount = (f) => {
        this.onUnmounts.push(f);
    };

    componentDidMount = () => {
        this._canUpdate = true;
        this.onMounts.forEach((f) => f());
    };

    componentWillUnmount = () => {
        this._canUpdate = false;
        this.onUnmounts.forEach((f) => f());
        this.unsubscribeAll();
    };
}