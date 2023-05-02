import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../logo.svg';
import { withAuth } from '../pages/Authentication';

function Navbar({ user }) {
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <img src={logo} alt="Smerre Logo" height="30" />
                    Smerre
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded={!collapsed ? true : false}
                    aria-label="Toggle navigation"
                    onClick={toggleNavbar}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className={`collapse navbar-collapse ${collapsed ? "" : "show"}`}
                    id="navbarNav"
                >
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/plant" className="nav-link">
                                Plants
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/component/control" className="nav-link">
                                Component control
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/automation" className="nav-link">
                                Automations
                            </Link>
                        </li>
                    </ul>
                    {!user ? (
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item my-1">
                                <Link to="/login" className="btn btn-outline-light me-2">
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item my-1">
                                <Link to="/register" className="btn btn-light">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    ):(
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item my-1">
                                <Link to="/" className="btn btn-outline-light me-2" onClick={() => {localStorage.removeItem('token'); this.forceUpdate();}}>
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default withAuth(Navbar, true);