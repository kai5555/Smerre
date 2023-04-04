import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

// Temperature routes
export const insertTemperature = payload => api.post(`/temperatures`, payload)
export const getAllTemperatures = () => api.get(`/temperatures`)
export const updateTemperatureById = (id, payload) => api.put(`/temperatures/${id}`, payload)
export const deleteTemperatureById = id => api.delete(`/temperatures/${id}`)
export const getTemperatureById = id => api.get(`/temperatures/${id}`)

// Humidity routes
export const getAllHumidity = () => api.get(`/humidity`)

// User routes
export const loginUser = payload => api.post(`/login`, payload);
export const registerUser = payload => api.post(`/register`, payload);
export const isUserAuth = payload => api.post(`/isUserAuth`, payload);
export const verifyEmailUser = payload => api.post(`/verifyEmailUser`, payload);
export const sendPasswordRecovery = payload => api.post(`/sendPasswordRecovery`, payload);
export const verifyPasswordRecovery = payload => api.post(`/verifyPasswordRecovery`, payload);
export const passwordRecovery = payload => api.post(`/passwordRecovery`, payload);

export const getAllActors = () => api.get(`/getAllActors`);
export const getAllSensors = () => api.get(`/getAllSensors`);

export const getAllAutomations = () => api.get(`/getAllAutomations`);
export const getAutomationById = () => api.get(`/getAllAutomations`);
export const createAutomation = () => api.get(`/createAutomation`);
export const updateAutomation = () => api.get(`/updateAutomation`);
export const deleteAutomation = () => api.get(`/deleteAutomation`);

const apis = {
    insertTemperature,
    getAllTemperatures,
    updateTemperatureById,
    deleteTemperatureById,
    getTemperatureById,

    getAllHumidity,

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
    getAutomationById,
    createAutomation,
    updateAutomation,
    deleteAutomation,
}

export default apis