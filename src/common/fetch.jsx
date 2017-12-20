import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Fetch extends Component {
    _isMounted = false;

    static propTypes = {
        resource: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        method: PropTypes.oneOf(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
        body: PropTypes.object,
        options: PropTypes.object
    };

    static defaultProps = {
        resource: '',
        method: 'GET',
        body: undefined,
        options: {},
    };

    constructor(props) {
        super(props);
    }

    getUrl = () => {
        const {resource} = this.props;
        let url = resource;
        if (typeof resource === 'function') {
            url = resource();
        }

        return url;
    };

    state = {
        loading: !!this.getUrl(),
        data: undefined,
        success: undefined,
        error: undefined,
        response: undefined,
    };

    prevUrl = this.getUrl();

    fetchData = url => {
        if (!url) return;

        // About to start fetching, set loading state
        this.setState(() => ({
            loading: true
        }));

        const {method, body, options} = this.props;
        const fetchOptions = {
            method,
            body,
            ...options
        };

        let response;
        fetch(url, fetchOptions)
            .then(result => {
                response = result.clone();
                return result.text();
            })
            .then(data => {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    // Not JSON
                }

                if (!this._isMounted) return;

                if (response.status >= 400 && response.status <= 599) {
                    this.setState(() => ({
                        data,
                        error: new Error(response.statusText),
                        loading: false,
                        success: false,
                        response,
                    }));
                    return;
                }

                this.setState(() => ({
                    data,
                    loading: false,
                    success: true,
                    response,
                }));
            })
            .catch(error => {
                if (!this._isMounted) return;

                this.setState(() => ({
                    error,
                    loading: false,
                    success: false,
                    response,
                }));
            });
    };

    urlHasChanged = () => {
        const {resource} = this.props;
        if (typeof resource !== 'function') {
            return this.prevUrl !== resource;
        }

        const currentUrl = resource();
        if (this.prevUrl !== currentUrl) {
            this.prevUrl = currentUrl;
            return true;
        }

        return false;
    };

    componentDidUpdate = () => {
        if (typeof this.props.resource === 'function' && this.urlHasChanged()) {
            this.fetchData(this.getUrl());
        }
    };

    componentDidMount = () => {
        this._isMounted = true;
        this.fetchData(this.getUrl());
    };

    componentWillUnmount = () => {
        this._isMounted = false;
    };

    render = () => {
        return this.props.children(this.state);
    }
}