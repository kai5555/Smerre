import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { NavBar } from '../components'
import { TemperaturesList, TemperatureInsert, TemperatureUpdate} from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <>
        <Router>
            <NavBar />
            <Routes>
                <Route path="/temperatures/list" exact component={TemperaturesList} />
                <Route path="/temperatures/create" exact component={TemperatureInsert} />
                <Route path="/temperatures/update/:id" exact component={TemperatureUpdate} />
            </Routes>
        </Router>
        <TemperaturesList></TemperaturesList>
        </>
    )
}

export default App