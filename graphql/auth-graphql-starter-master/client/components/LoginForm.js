import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { hashHistory } from 'react-router';

import AuthForm from './AuthForm';
import mutation from '../mutations/Login';
import query from '../queries/CurrentUser';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = { errors: [] };
    }

    componentWillUpdate(nextProps) {
        // this.props // the old, current set of props
        // nextProps // the next set of props that will be in place when the component rerenders
        console.log(this.props, nextProps);
        if(!this.props.data.user && nextProps.data.user) {
            // redirect to dashboard page
            hashHistory.push('/dashboard');
        }
    }

    onSubmit({ email, password }) {
        this.props.mutate({
            variables: { email, password },
            refetchQueries: [{ query: query }]
            // refetchQueries: [{ query: query, variables: { id: this.props.id } }]
        }).catch(res => {
            const errors = res.graphQLErrors.map(error => error.message);
            this.setState({ errors: errors });
        });
    }

    render() {
        return (
            <div>
                <h3>Login</h3>
                <AuthForm 
                    onSubmit={this.onSubmit.bind(this)} 
                    errors={this.state.errors} 
                />
            </div>
        );
    };
}

export default graphql(query)(
    graphql(mutation)(LoginForm)
);