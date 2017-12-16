import React, {Component} from 'react';
import store from './store-3';

export default class Component3 extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = store.getState();
    }

    handleClick = (e) => {
        this.setState((prevState) => {
            return {count: prevState.count + 1};
        }, () => {
            store.setState(this.state);
        });
    };

    render() {
        const {count} = this.state;
        return (
            <div>
                <button onClick={this.handleClick}> Click me!</button>
                <p>
                    {count}
                </p>
            </div>
        );
    }
}