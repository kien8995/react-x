import React, {Component} from 'react';
import Fetch from '../common/fetch';

export default class Component5 extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>
                <Fetch resource={"https://reqres.in/api/login"} method={"POST"} body={JSON.stringify({
                    "email": "peter@klaven",
                    "password": "cityslicka"
                })}>
                    {({loading, data, error, response}) => {
                        if(loading) return <p>loading...</p>;
                        if(error) return <p>{`Error: ${JSON.stringify(data)}`}</p>;
                        return <p>{JSON.stringify(data)}</p>
                    }}
                </Fetch>
            </div>
        );
    }
}