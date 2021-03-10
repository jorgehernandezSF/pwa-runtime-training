import jwt from 'njwt'
import {isTokenValid} from './utils'

const createJwt = (secondsToExp) => {
    const token = jwt.create({}, 'test')
    token.setExpiration(new Date().getTime() + secondsToExp * 1000)
    return token.compact()
}

describe('isTokenValid', () => {
    test('returns false when no token given', () => {
        expect(isTokenValid()).toBe(false)
    })

    test('returns true for valid token', () => {
        const token = createJwt(600)
        const bearerToken = `Bearer ${token}`
        expect(isTokenValid(token)).toBe(true)
        expect(isTokenValid(bearerToken)).toBe(true)
    })

    test('returns false if token expires within 60 econds', () => {
        expect(isTokenValid(createJwt(59))).toBe(false)
    })
})

describe('getProtocolHostAndPort', () => {
    const OLD_ENV = process.env
    const OLD_WINDOW = global.window

    beforeEach(() => {
        jest.resetModules()
        process.env = {...OLD_ENV}
    })

    afterAll(() => {
        process.env = OLD_ENV
        global.window = OLD_WINDOW
    })

    test('returns no host and port in browser', () => {
        const {getProtocolHostAndPort} = require('./utils')
        expect(getProtocolHostAndPort()).toBe('')
    })

    test('returns local dev host and port on server during dev', () => {
        delete global.window
        process.env.NODE_ENV = 'development'
        process.env.EXTERNAL_DOMAIN_NAME = ''
        const {getProtocolHostAndPort} = require('./utils')
        expect(getProtocolHostAndPort()).toBe('http://localhost:3000')
    })

    test('returns external domain env var on server when on production', () => {
        delete global.window
        process.env.NODE_ENV = 'production'
        process.env.EXTERNAL_DOMAIN_NAME = 'prod.test.com'
        const {getProtocolHostAndPort} = require('./utils')
        expect(getProtocolHostAndPort()).toBe('https://prod.test.com')
    })
})
