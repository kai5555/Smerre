import React from 'react';
import api, {toggleLed} from "../api";
import { Navigate  } from 'react-router-dom';
const withAuth = (Component) => {
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

            this.setState({
                loading: false,
                authenticated: isAuthenticated,
            });
        }

        render() {
            const { loading, authenticated } = this.state;

            if (loading) {
                return <div>Loading...</div>;
            }

            if (authenticated) {
                return <Component {...this.props} />;
            }

            return <Navigate to="/login" />;
        }
    }

    return AuthenticatedComponent;
};

export {withAuth};