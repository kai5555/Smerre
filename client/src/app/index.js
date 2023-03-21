import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { NavBar } from '../components'
import { TemperaturesList, TemperatureInsert, TemperatureUpdate, ComponentControl} from '../pages'


import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <>
        <Router>
            <NavBar />
            <Routes>
                <Route path="/temperatures/list" element={<TemperaturesList />} />
                <Route path="/temperatures/create" element={<TemperatureInsert />} />
                <Route path="/temperatures/update/:id" element={< TemperatureUpdate />} />
                <Route path="/component/control" element={< ComponentControl />} />
            </Routes>
        </Router>
        </>
    )
}

export default App