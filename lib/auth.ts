import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'

// Configure your backend API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = Cookies.get('refresh-token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })
          
          const { token } = response.data
          Cookies.set('auth-token', token, { expires: 7 })
          
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        logout()
        window.location.href = '/'
      }
    }
    
    return Promise.reject(error)
  }
)

// Authentication functions
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', credentials)
    const { user, token, refreshToken } = response.data
    
    // Store tokens in cookies
    Cookies.set('auth-token', token, { expires: 7 })
    if (refreshToken) {
      Cookies.set('refresh-token', refreshToken, { expires: 30 })
    }
    
    // Store user data
    Cookies.set('user', JSON.stringify(user), { expires: 7 })
    
    return { user, token, refreshToken }
  } catch (error) {
    throw new Error(`Login failed: ${error}`)
  }
}

export const logout = () => {
  Cookies.remove('auth-token')
  Cookies.remove('refresh-token')
  Cookies.remove('user')
}

export const getCurrentUser = (): User | null => {
  const userStr = Cookies.get('user')
  return userStr ? JSON.parse(userStr) : null
}

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('auth-token')
}

// Export the configured axios instance
export { api }