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
}

export default apis