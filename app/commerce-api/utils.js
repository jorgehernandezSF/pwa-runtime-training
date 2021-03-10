import {createContext, useContext} from 'react'
import jwtDecode from 'jwt-decode'

/**
 * Compares the token age against the issued and expiry times. If the token's age is
 * within 60 seconds of its valid time (or exceeds it), we consider the token invalid.
 * @function
 * @param {string} token - The JWT bearer token to be inspected
 * @returns {boolean}
 */
export function isTokenValid(token) {
    if (!token) {
        return false
    }
    const {exp, iat} = jwtDecode(token.replace('Bearer ', ''))
    const validTimeSeconds = exp - iat - 60
    const tokenAgeSeconds = Date.now() / 1000 - iat
    if (validTimeSeconds > tokenAgeSeconds) {
        return true
    }
    return false
}

/**
 * Returns the application's protocol and host.
 * @function
 * @returns {string}
 */
export function getProtocolHostAndPort() {
    if (typeof window !== 'undefined') {
        return ''
    }
    if (process.env.NODE_ENV !== 'production' && !process.env.EXTERNAL_DOMAIN_NAME) {
        return 'http://localhost:3000'
    }
    return `https://${process.env.EXTERNAL_DOMAIN_NAME}`
}

/**
 * Provider and associated hook for accessing the API in React components.
 */
export const CommerceAPIContext = createContext()
export const CommerceAPIProvider = CommerceAPIContext.Provider
export const useCommerceAPI = () => useContext(CommerceAPIContext)
