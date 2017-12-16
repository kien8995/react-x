import React from 'react';
import XComponent from '../common/x-component';
import store from './store-1';

export default class Component2 extends XComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            count: 0
        }
    }

    subscriber = (value) => {
        this.setState({count: value.count});
    };

    componentWillMount = () => {
        this.subscribe(store, this.subscriber);
    };

    render() {
        return (
            <div>
                <p>Listener 1: {this.state.count}</p>
            </div>
        );
    }
}