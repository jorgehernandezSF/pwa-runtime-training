/* eslint-disable no-unused-vars */
import * as sdk from 'commerce-sdk-isomorphic'
import {isTokenValid, getProtocolHostAndPort} from './utils'

/**
 * The configuration details for the connecting to the API.
 * @typedef {Object} ClientConfig
 * @property {string} [proxy] - URL to proxy fetch calls through.
 * @property {string} [headers] - Request headers to be added to requests.
 * @property {Object} [parameters] - API connection parameters for SDK.
 * @property {string} [parameters.clientId]
 * @property {string} [parameters.organizationId]
 * @property {string} [parameters.shortCode]
 * @property {string} [parameters.siteId]
 * @property {string} [parameters.version]
 */

/**
 * An object containing the customer's login credentials.
 * @typedef {Object} CustomerCredentials
 * @property {string} credentials.email
 * @property {string} credentials.password
 */

/**
 * Salesforce Customer object.
 * {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/modules/shoppercustomers.html#customer}}
 * @typedef {Object} Customer
 */

const tokenStorageKey = 'token'

/**
 * A wrapper class that proxies calls to the underlying commerce-sdk-isomorphic.
 * The sdk class instances are created automatically with the given config.
 */
class CommerceAPI {
    /**
     * Create an instance of the API with the given config.
     * @param {ClientConfig} config - The config used to instantiate SDK apis.
     */
    constructor(config = {}) {
        const {proxyPath, ...restConfig} = config

        // Client-side requests should be proxied via the configured path.
        const proxy = `${getProtocolHostAndPort() || 'http://localhost:3000'}${proxyPath}`

        this._config = {proxy, ...restConfig}
        this._pendingAuth = undefined
        this._customerId = undefined
        this._authToken =
            typeof window !== 'undefined' ? window.localStorage.getItem(tokenStorageKey) : undefined

        // A mapping of property names to the SDK class constructors we'll be
        // providing instances for.
        const apis = {
            shopperCustomers: sdk.ShopperCustomers,
            shopperBaskets: sdk.ShopperBaskets,
            shopperGiftCertificates: sdk.ShopperGiftCertificates,
            shopperLogin: sdk.ShopperLogin,
            shopperOrders: sdk.ShopperOrders,
            shopperProducts: sdk.ShopperProducts,
            shopperPromotions: sdk.ShopperPromotions,
            shopperSearch: sdk.ShopperSearch
        }

        // Instantiate the SDK class proxies and create getters from our api mapping.
        // The proxy handlers are called when accessing any of the mapped SDK class
        // proxies, executing various pre-defined hooks for tapping into or modifying
        // the outgoing method parameters and/or incoming SDK responses
        const self = this
        Object.keys(apis).forEach((key) => {
            const SdkClass = apis[key]
            self._sdkInstances = {
                ...self._sdkInstances,
                [key]: new Proxy(new SdkClass(this._config), {
                    get: function(obj, prop) {
                        if (typeof obj[prop] === 'function') {
                            return (...args) => {
                                if (args[0].ignoreHooks) {
                                    return obj[prop](...args)
                                }
                                return self.willSendRequest(prop, ...args).then((newArgs) => {
                                    return obj[prop](...newArgs).then((res) =>
                                        self.didReceiveResponse(res, newArgs)
                                    )
                                })
                            }
                        }
                        return obj[prop]
                    }
                })
            }
            Object.defineProperty(self, key, {
                get() {
                    return self._sdkInstances[key]
                }
            })
        })

        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.getConfig = this.getConfig.bind(this)
    }

    /**
     * Returns the api client configuration
     * @returns {ClientConfig}
     */
    getConfig() {
        return this._config
    }

    /**
     * Executed before every proxied method call to the SDK. Provides the method
     * name and arguments. This can be overidden in a subclass to perform any
     * logging or modifications to arguments before the request is sent.
     * @param {string} methodName - The name of the sdk method that will be called.
     * @param {...*} args - Original arguments for the SDK method.
     * @returns {Promise<Array>} - Updated arguments that will be passed to the SDK method
     */
    async willSendRequest(methodName, ...params) {
        // We never need to modify auth request headers for this method.
        if (methodName === 'authorizeCustomer') {
            return params
        }

        // If a login promise exists, we don't proceed unless it is resolved.
        if (this._pendingLogin) {
            await this._pendingLogin
        }

        // If the token is invalid (missing, past/nearing expiration), we issue
        //  a login call, which will attempt to refresh the token or get a new
        //  guest token. Once login is complete, we can proceed.
        if (!isTokenValid(this._authToken)) {
            await this.login()
        }

        // Apply the appropriate auth headers and return new options
        const [fetchOptions, ...restParams] = params
        const newFetchOptions = {
            ...fetchOptions,
            headers: {...fetchOptions.headers, Authorization: this._authToken}
        }
        return [newFetchOptions, ...restParams]
    }

    /**
     * Executed when receiving a response from an SDK request. The response data
     * can be mutated or inspected before being passed back to the caller. Should
     * be overidden in a subclass.
     * @param {*} response - The response from the SDK method call.
     * @param {Array} args - Original arguments for the SDK method.
     * @returns {*} - The response to be passed back to original caller.
     */
    didReceiveResponse(response, args) {
        return response
    }

    /**
     * Authorizes the customer as a registered or guest user.
     * @param {CustomerCredentials} [credentials]
     * @returns {Promise<Customer>}
     */
    async login(credentials) {
        // Calling login while its already pending will return a reference
        // to the existing promise.
        if (this._pendingLogin) {
            return this._pendingLogin
        }

        let retries = 0

        const startLoginFlow = (loginType) => {
            return this._authorize(loginType, credentials).catch((error) => {
                if (retries === 0 && error.message === 'EXPIRED_TOKEN') {
                    retries = 1 // we only retry once
                    this._clearAuth()
                    return startLoginFlow('guest')
                }
                throw error
            })
        }

        this._pendingLogin = startLoginFlow().finally(() => {
            // When the promise is resolved, we need to remove the reference so
            // that subsequent calls to `login` can proceed.
            this._pendingLogin = undefined
        })

        return this._pendingLogin
    }

    /**
     * Clears the stored auth token and optionally logs back in as guest.
     * @param {boolean} [shouldLoginAsGuest=true] - Indicates if we should automatically log back in as a guest
     * @returns {(Promise<Customer>|undefined)}
     */
    async logout(shouldLoginAsGuest = true) {
        this._clearAuth()
        if (shouldLoginAsGuest) {
            return this.login()
        }
    }

    /**
     * Fetches an auth token and customer data.
     * @private
     * @param {('credentials'|'guest'|'refresh')} [_loginType]
     * @param {CustomerCredentials} [credentials]
     * @returns {{authToken: string, customer: Customer}}
     */
    async _authorize(_loginType, credentials) {
        const loginType = _loginType || (credentials ? 'credentials' : 'guest')
        const authorization = credentials
            ? `Basic ${btoa(`${credentials.email}:${credentials.password}`)}`
            : this._authToken
        const options = {
            body: {
                type: this._authToken && !credentials ? 'refresh' : loginType
            },
            ...(authorization && {
                headers: {
                    Authorization: authorization
                }
            })
        }
        const rawResponse = await this.shopperCustomers.authorizeCustomer(options, true)
        const resJson = await rawResponse.json()
        const authToken = rawResponse.headers.get('authorization')

        if (rawResponse.status >= 400) {
            if (resJson.title === 'Expired Token') {
                throw new Error('EXPIRED_TOKEN')
            }
            throw new Error(resJson.detail)
        }

        this._customerId = resJson.customerId
        this._saveToken(authToken)

        return {
            authToken,
            customer: resJson
        }
    }

    /**
     * Stores the given auth token.
     * @private
     * @param {string} token - A JWT auth token.
     */
    _saveToken(token) {
        this._authToken = token
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(tokenStorageKey, token)
        }
    }

    /**
     * Removes the stored auth token.
     * @private
     */
    _clearAuth() {
        this._customerId = undefined
        this._authToken = undefined
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(tokenStorageKey)
        }
    }
}

export default CommerceAPI
