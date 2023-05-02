import React from 'react';
import api, {toggleLed} from "../api";
import { Navigate  } from 'react-router-dom';
const withAuth = (Component, renderAnyway=false) => {
    class AuthenticatedComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                loading: true,
                authenticated: false,
            };
        }

        async componentDidMount() {
            const res = await api.isUserAuth({ token: localStorage.getItem("token") });
            let isAuthenticated = res.data.isLoggedIn;
            let user = res.data.username;

            this.setState({
                loading: false,
                user: user,
                authenticated: isAuthenticated,
            });
        }


        render() {
            const { loading, authenticated } = this.state;

            if (loading) {
                return <div>Loading...</div>;
            }

            if (authenticated || renderAnyway) {
                return <Component {...this.props} user={this.state.user} />;
            }

            return <Navigate to="/login" />;
        }
    }

    return AuthenticatedComponent;
};

export {withAuth};