import axios from 'axios'

const api = axios.create({
    baseURL: 'http://10.129.48.9:5000/api',
})

// Data routes
export const getDataOfPlant = payload => api.post(`/getDataOfPlant`, payload)
export const getDataOfSensor = payload => api.post(`/getDataOfSensor`, payload)
export const clearData = () => api.post(`/clearData`)

// User routes
export const loginUser = payload => api.post(`/login`, payload);
export const registerUser = payload => api.post(`/register`, payload);
export const isUserAuth = payload => api.post(`/isUserAuth`, payload);
export const verifyEmailUser = payload => api.post(`/verifyEmailUser`, payload);
export const sendPasswordRecovery = payload => api.post(`/sendPasswordRecovery`, payload);
export const verifyPasswordRecovery = payload => api.post(`/verifyPasswordRecovery`, payload);
export const passwordRecovery = payload => api.post(`/passwordRecovery`, payload);

// Component routes
export const getAllActors = () => api.get(`/getAllActors`);
export const getAllSensors = () => api.get(`/getAllSensors`);

// Automation routes
export const getAllAutomations = () => api.get(`/getAllAutomations`);
export const getAutomationByName = payload => api.post(`/getAutomationByName`, payload);
export const createAutomation = payload => api.post(`/createAutomation`, payload);
export const updateAutomation = payload => api.post(`/updateAutomation`, payload);
export const deleteAutomation = payload => api.post(`/deleteAutomation`, payload);
export const toggleAutomation = payload => api.post(`/toggleAutomation`, payload);

// Plant routes
export const getAllPlants = () => api.get(`/getAllPlants`);
export const getPlantByName = payload => api.post(`/getPlantByName`, payload);
export const createPlant = payload => api.post(`/createPlant`, payload);
export const updatePlant = payload => api.post(`/updatePlant`, payload);
export const deletePlant = payload => api.post(`/deletePlant`, payload);

const apis = {
    getDataOfPlant,
    getDataOfSensor,
    clearData,

    loginUser,
    registerUser,
    isUserAuth,
    verifyEmailUser,
    sendPasswordRecovery,
    verifyPasswordRecovery,
    passwordRecovery,
    
    getAllActors,
    getAllSensors,

    getAllAutomations,
    getAutomationByName,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomation,

    getAllPlants,
    getPlantByName,
    createPlant,
    updatePlant,
    deletePlant,
}

export default apis