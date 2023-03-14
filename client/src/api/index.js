import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

export const insertTemperature = payload => api.post(`/temperatures`, payload)
export const getAllTemperatures = () => api.get(`/temperatures`)
export const updateTemperatureById = (id, payload) => api.put(`/temperatures/${id}`, payload)
export const deleteTemperatureById = id => api.delete(`/temperatures/${id}`)
export const getTemperatureById = id => api.get(`/temperatures/${id}`)


const apis = {
    insertTemperature,
    getAllTemperatures,
    updateTemperatureById,
    deleteTemperatureById,
    getTemperatureById,
}

export default apis