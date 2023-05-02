import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { NavBar } from '../components'
import { PlantList, Plant, AddPlant, ComponentControl, Login, Register, EmailVerify, PasswordRecovery, PasswordRecoveryVerify, AddAutomation, EditAutomation, Automations, WeatherApi} from '../pages'

import '../scripts/icons'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <>
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<WeatherApi />} />
                <Route path="/plant" element={<PlantList />} />
                <Route path="/plant/:name" element={<Plant />} />
                <Route path="/plant/add" element={<AddPlant />} />
                <Route path="/component/control" element={< ComponentControl />} />
                <Route path="/login" element={< Login />} />
                <Route path="/register" element={< Register />} />
                <Route path="/verify/:id/:token" element={< EmailVerify />} />
                <Route path="/recovery" element={< PasswordRecovery />} />
                <Route path="/recovery/:id/:token" element={< PasswordRecoveryVerify />} />
                <Route path="/automation/add" element={< AddAutomation />} />
                <Route path="/automation/:name/edit" element={< EditAutomation />} />
                <Route path="/weather" element={< WeatherApi />}></Route>
                <Route path="/automation" element={< Automations />} />
            </Routes>
        </Router>
        </>
    )
}

export default App