import CommerceAPI from '.'

// NOTE: this will need to be a fixed or known config for testing against
// It will probably end up living in pwa-kit later on so we may want to
// deal with it there.
import {commerceAPIConfig} from '../commerce-api.config'

const apiConfig = {...commerceAPIConfig, proxy: undefined}
const email = 'reftest@64labs.com'
const password = '64Labs2020!'
const expiredAuthToken =
    'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjE2MDc1MzkwMDUwNTciLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJjOWM0NWJmZC0wZWQzLTRhYTItOTk3MS00MGY4ODk2MmI4MzYiLCJleHAiOjE2MTIzNjY4NTcsImlhdCI6MTYxMjM2NTA1NywiaXNzIjoiY29tbWVyY2VjbG91ZC9wcm9kdWN0aW9uL3p6cmYtMDAxLTY0NDlhYTgzLTUwYzItNGE1Yy1iNGE2LWIyM2VjOWNkMGExOS0zIiwic2NvcGUiOlsiU0FMRVNGT1JDRV9DT01NRVJDRV9BUEk6enpyZl8wMDEiLCJzZmNjLnByb2R1Y3RzLnJ3Iiwic2ZjYy5zaG9wcGVyLWJhc2tldHMtb3JkZXJzLnJ3Iiwic2ZjYy5zaG9wcGVyLWNhdGVnb3JpZXMiLCJzZmNjLnNob3BwZXItY3VzdG9tZXJzLmxvZ2luIiwic2ZjYy5zaG9wcGVyLWN1c3RvbWVycy5yZWdpc3RlciIsInNmY2Muc2hvcHBlci1naWZ0LWNlcnRpZmljYXRlcyIsInNmY2Muc2hvcHBlci1teWFjY291bnQuYWRkcmVzc2VzLnJ3Iiwic2ZjYy5zaG9wcGVyLW15YWNjb3VudC5iYXNrZXRzIiwic2ZjYy5zaG9wcGVyLW15YWNjb3VudC5vcmRlcnMiLCJzZmNjLnNob3BwZXItbXlhY2NvdW50LnBheW1lbnRpbnN0cnVtZW50cy5ydyIsInNmY2Muc2hvcHBlci1teWFjY291bnQucHJvZHVjdGxpc3RzLnJ3Iiwic2ZjYy5zaG9wcGVyLW15YWNjb3VudC5ydyIsInNmY2Muc2hvcHBlci1wcm9kdWN0LXNlYXJjaCIsInNmY2Muc2hvcHBlci1wcm9tb3Rpb25zIiwic2ZjYy5zaG9wcGVyLnN0b3JlcyIsInNmY2Muc2hvcHBlci1wcm9kdWN0cyJdLCJzdWIiOiJ7XCJDdXN0b21lckluZm9cIjp7XCJjdXN0b21lcklkXCI6XCJhYlpYYk9IQ1NUUTJDUmNoVnpQUDNyUlVNaFwiLFwiZ3Vlc3RcIjp0cnVlLFwidmlzaXRJZFwiOlwiOTRmYjVhNGZhMWM5MzAzN2E4ZTg1YjJhMmJcIn19In0.JVbGySy4qk2DD1ZXTdTjNY_iWzlejX0L-rukF0qPIwyswYpRGr4MiTgh29c4AUSuhUdsqQtJoW1VcGvdYGU9Og'

const getAPI = () => new CommerceAPI(apiConfig)

jest.mock('commerce-sdk-isomorphic', () => {
    const sdk = jest.requireActual('commerce-sdk-isomorphic')
    return {
        ...sdk,
        ShopperProducts: class ShopperProductsMock extends sdk.ShopperProducts {
            async getProduct(args) {
                return args
            }
            async getProducts(options) {
                return options.parameters.ids.map((id) => ({id}))
            }
        }
    }
})

beforeEach(() => {
    jest.resetModules()
})

describe('CommerceAPI', () => {
    test('provides instantiated sdk classes as instance properties using given config', () => {
        const api = getAPI()
        const apiNames = [
            'shopperCustomers',
            'shopperBaskets',
            'shopperGiftCertificates',
            'shopperLogin',
            'shopperOrders',
            'shopperProducts',
            'shopperPromotions',
            'shopperSearch'
        ]
        expect(api.shopperCustomers.clientConfig.parameters).toEqual(apiConfig.parameters)
        apiNames.forEach((name) => expect(api[name]).toBeDefined())
        expect(typeof api.shopperCustomers.getCustomer).toBe('function')
    })

    test('returns api config', () => {
        const config = getAPI().getConfig()
        expect(config.parameters).toEqual(apiConfig.parameters)
    })

    test('calls willSendResponse with request name and options', () => {
        const api = getAPI()
        const spy = jest.spyOn(api, 'willSendRequest')
        api.shopperProducts.getProduct({parameters: {id: '123'}})
        expect(spy).toHaveBeenCalledWith('getProduct', {parameters: {id: '123'}})
    })

    test('can optionally ignore req/res hooks', () => {
        const api = getAPI()
        const spy = jest.spyOn(api, 'willSendRequest')
        api.shopperProducts.getProduct({parameters: {id: '123'}, ignoreHooks: true})
        expect(spy).not.toHaveBeenCalled()
    })

    test('applies updated options when calling sdk methods', async () => {
        class MyAPI extends CommerceAPI {
            async willSendRequest() {
                return [{parameters: {id: '567'}}]
            }
        }
        const myAPI = new MyAPI(apiConfig)
        const result = await myAPI.shopperProducts.getProduct({parameters: {id: '123'}})
        expect(result).toEqual({parameters: {id: '567'}})
    })

    test('can modify response before returning to caller', async () => {
        const spy = jest.fn()
        class MyAPI extends CommerceAPI {
            async willSendRequest(method, ...args) {
                return args
            }
            async didReceiveResponse(response, args) {
                spy(response, args)
                return `${response.length} product`
            }
        }
        const myAPI = new MyAPI(apiConfig)
        const result = await myAPI.shopperProducts.getProducts({parameters: {ids: ['123']}})
        expect(spy).toHaveBeenCalledWith([{id: '123'}], [{parameters: {ids: ['123']}}])
        expect(result).toBe('1 product')
    })

    test('authorizes guest user', async () => {
        const api = getAPI()
        const {customer} = await api.login()
        expect(customer.authType).toBe('guest')
    })

    test('authorizes registered user', async () => {
        const api = getAPI()
        const {customer} = await api.login({email, password})
        expect(customer.authType).toBe('registered')
    })

    test('refreshes existing token', async () => {
        const api = getAPI()
        await api.login()
        const existingToken = api._authToken
        const existingCustomerId = api._customerId
        await api.login()
        expect(api._authToken).toBeDefined()
        expect(api._authToken).not.toEqual(existingToken)
        expect(api._customerId).toEqual(existingCustomerId)
    })

    test('re-authorizes as guest when existing token is expired', async () => {
        const api = getAPI()
        await api.login()
        const existingCustomerId = api._customerId
        api._saveToken(expiredAuthToken)
        const {customer} = await api.login()
        expect(api._authToken).toBeDefined()
        expect(api._authToken).not.toEqual(expiredAuthToken)
        expect(api._customerId).not.toEqual(existingCustomerId)
        expect(customer.authType).toBe('guest')
    })

    test('logs back in as new guest after log out', async () => {
        const api = getAPI()
        await api.login()
        const existingToken = api._authToken
        const existingCustomerId = api._customerId
        expect(existingToken).toBeDefined()
        expect(existingCustomerId).toBeDefined()
        await api.logout()
        expect(api._authToken).toBeDefined()
        expect(api._authToken).not.toEqual(existingToken)
        expect(api._customerId).toBeDefined()
        expect(api._customerId).not.toEqual(existingCustomerId)
    })

    test('clears all auth data upon logout and does not log back in as guest', async () => {
        const api = getAPI()
        await api.login()
        const existingToken = api._authToken
        const existingCustomerId = api._customerId
        expect(existingToken).toBeDefined()
        expect(existingCustomerId).toBeDefined()
        await api.logout(false)
        expect(api._authToken).not.toBeDefined()
        expect(api._customer).not.toBeDefined()
    })

    test('automatically authorizes customer when calling sdk methods', async () => {
        const api = getAPI()
        await api.shopperProducts.getProduct({parameters: {id: '10048'}})
        expect(api._authToken).toBeDefined()
        expect(api._customerId).toBeDefined()
    })

    test('calling login while its already pending returns existing promise', () => {
        const api = getAPI()
        const pendingLogin = api.login()
        const secondPendingLogin = api.login()
        expect(pendingLogin).toEqual(secondPendingLogin)
    })

    test('throws error for expired token', async () => {
        jest.doMock('commerce-sdk-isomorphic', () => {
            const sdk = jest.requireActual('commerce-sdk-isomorphic')
            return {
                ...sdk,
                ShopperCustomers: class ShopperCustomersMock {
                    async authorizeCustomer() {
                        return {
                            status: 401,
                            headers: {
                                get: () => null
                            },
                            json: async () => {
                                return {title: 'Expired Token'}
                            }
                        }
                    }
                }
            }
        })
        const _CommerceAPI = require('./index').default
        const api = new _CommerceAPI(apiConfig)
        await expect(api.login()).rejects.toThrow('EXPIRED_TOKEN')
    })

    test('throws error with detail for >= 400 status', async () => {
        jest.doMock('commerce-sdk-isomorphic', () => {
            const sdk = jest.requireActual('commerce-sdk-isomorphic')
            return {
                ...sdk,
                ShopperCustomers: class ShopperCustomersMock {
                    async authorizeCustomer() {
                        return {
                            status: 401,
                            headers: {
                                get: () => null
                            },
                            json: async () => {
                                return {detail: 'Something went wrong'}
                            }
                        }
                    }
                }
            }
        })
        const _CommerceAPI = require('./index').default
        const api = new _CommerceAPI(apiConfig)
        await expect(api.login()).rejects.toThrow('Something went wrong')
    })
})
