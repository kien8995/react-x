import React from 'react';
import XComponent from '../common/x-component';
import store from './store-3';

export default class Component4 extends XComponent {
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
                <p>Listener 2: {this.state.count}</p>
            </div>
        );
    }
}