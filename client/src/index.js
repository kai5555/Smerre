import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Automations from "./pages/Automations";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import NoPage from "./pages/NoPage";

class App extends React.Component {
    handleClick = async () => {
        try{
            const response = await fetch('http://10.128.68.55:8123/api/services/switch/toggle', {
                method: 'POST',
                body: JSON.stringify({
                    "entity_id": "switch.status_led",
                }),
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            console.log(err.message);
        }
    }
    
    render() {
        return(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="account" element={<Account />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="automations" element={<Automations />} />
                    <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);





