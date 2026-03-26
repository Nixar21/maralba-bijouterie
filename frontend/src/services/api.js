import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

API.interceptors.request.use(config => {
    const token = localStorage.getItem('maralba_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export const getProducts = (categoria) =>
    API.get('/api/products', { params: categoria ? { categoria } : {} })

export const getProduct = (id) => API.get(`/api/products/${id}`)

export const createProduct = (formData) =>
    API.post('/api/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const updateProduct = (id, formData) =>
    API.put(`/api/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const deleteProduct = (id) => API.delete(`/api/products/${id}`)

export const login = (email, password) =>
    API.post('/api/auth/login', { email, password })

export const createOrder = (orderData) =>
    API.post('/api/orders', orderData)

export const getOrders = () =>
    API.get('/api/orders')