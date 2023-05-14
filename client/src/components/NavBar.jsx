import {Link, useLocation} from 'react-router-dom';
import {useEffect, useState } from 'react';
import logo from '../logo.svg';
import { withAuth } from '../pages/Authentication';

function Navbar({ user }) {

    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if(!user){
            setLoggedIn(false);
        }
        else setLoggedIn(true);

    }, [user]);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: "#07181A", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)"}}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand me-5 pe-4">
                    <img src={logo} alt="Smerre Logo" height="20" style={{marginRight: "0px", marginBottom: "2px"}}/>
                    <span style={{color: "white"}}>merre</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded={!collapsed}
                    aria-label="Toggle navigation"
                    onClick={toggleNavbar}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className={`collapse navbar-collapse ${collapsed ? "" : "show"}`}
                    id="navbarNav"
                >
                    <ul className="navbar-nav  mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/plant" className="nav-link active text-secondary" onClick={toggleNavbar}
                                  style={location.pathname === '/plant' ? { textDecoration: "underline", textUnderlineOffset: "0.3em", textDecorationColor: "white" }:{}}>
                                Plants
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/component/control" className="nav-link text-secondary" onClick={toggleNavbar}
                                  style={location.pathname === '/component/control' ? { textDecoration: "underline", textUnderlineOffset: "0.3em", textDecorationColor: "white" }:{}}>
                                Component control
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/automation" className="nav-link text-secondary" onClick={toggleNavbar}
                                style={location.pathname === '/automation' ? { textDecoration: "underline", textUnderlineOffset: "0.3em", textDecorationColor: "white" }:{}}>
                                Automations
                            </Link>
                        </li>
                    </ul>
                    {!loggedIn ? (
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item my-1">
                                <Link to="/login" className="btn btn-outline-light me-2" onClick={toggleNavbar}>
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item my-1">
                                <Link to="/register" className="btn btn-light" onClick={toggleNavbar}>
                                    Register
                                </Link>
                            </li>
                        </ul>
                    ):(
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item my-1 ms-lg-4">
                                <Link to="/landing" className="btn btn-outline-light  ms-lg-5" onClick={() => {localStorage.removeItem('token'); setLoggedIn(false); toggleNavbar()}}>
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