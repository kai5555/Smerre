import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { NavBar } from '../components'
import { TemperaturesList, ComponentControl, Login, Register, EmailVerify} from '../pages'


import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <>
        <Router>
            <NavBar />
            <Routes>
                <Route path="/temperatures/list" element={<TemperaturesList />} />
                <Route path="/component/control" element={< ComponentControl />} />
                <Route path="/login" element={< Login />} />
                <Route path="/register" element={< Register />} />
                <Route path="/verify/:id/:token" element={< EmailVerify />} />
            </Routes>
        </Router>
        </>
    )
}

export default App