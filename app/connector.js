/* istanbul ignore file */

// NOTE: This file is temporary and should be removed once the isomorphic sdk is used.

// This file ignored for coverage because it is replaced when a project is generated.

// IMPORTANT: "mobify-test-connector" is not a real module - this is a webpack
// trick to avoid compiling all connectors into the bundle when we only use one at a
// time - this is controlled by an environment variable.
//
// This hack doesn't make it into a generated project, because this file is replaced
// by the generator.

export const getConnector = () => {
    return new DemoConnector()
}

// NOTE: Below in the implementation of the DemoConnector copied into this file temporarily.
// It will be removed some the PWA starts using the isomorpic client.

/**
 * The `errors` module contains any error type classes used by
 * Commerce Integrations.
 * @module @mobify/commerce-integrations/dist/errors
 */
export class ConnectorError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.constructor = ConnectorError
        this.__proto__ = ConnectorError.prototype
        this.message = message
        this.statusCode = statusCode
    }

    toString() {
        return `ConnectorError ${this.statusCode}: ${this.message}`
    }
}

/**
 * The user supplied invalid arguments to a function/method.
 * Usually an error in code.
 */
export class InvalidArgumentError extends ConnectorError {
    constructor(msg) {
        super(400, msg)
        this.constructor = InvalidArgumentError
        this.__proto__ = InvalidArgumentError.prototype
    }
}

/**
 * The server returned an error response.
 */
export class ServerError extends ConnectorError {
    constructor(msg) {
        super(500, msg)
        this.constructor = ServerError
        this.__proto__ = ServerError.prototype
    }
}

/**
 * The server returned a forbidden response.
 */
export class ForbiddenError extends ConnectorError {
    constructor(msg) {
        super(403, msg)
        this.constructor = ForbiddenError
        this.__proto__ = ForbiddenError.prototype
    }
}

/**
 * The server returned a not found response.
 */
export class NotFoundError extends ConnectorError {
    constructor(msg) {
        super(404, msg)
        this.constructor = NotFoundError
        this.__proto__ = NotFoundError.prototype
    }
}

/**
 * The called method is not implemented or supported on a backend.
 */
export class UnsupportedError extends ConnectorError {
    constructor(msg) {
        super(500, msg)
        this.constructor = UnsupportedError
        this.__proto__ = UnsupportedError.prototype
    }
}

/**
 * A request was rejected because the user is not authenticated.
 *
 * In screen-scraping APIs this may be different from a "Forbidden"
 * response - eg. a redirect to a login page might trigger the error.
 */
export class NotAuthenticatedError extends ConnectorError {
    constructor(msg) {
        super(401, msg)
        this.constructor = NotAuthenticatedError
        this.__proto__ = NotAuthenticatedError.prototype
    }
}

// Third party modules
import stringify from 'json-stable-stringify'

/**
 * Create a promise that will resolve in a given number of milliseconds.
 *
 * @param {Integer} duration
 * @return {Promise<undefined>}
 */
const delay = (duration = 500) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, duration)
    })

/**
 * This is a demo connector used to test Mobify's scaffold. It returns canned
 * responses, rather than making real network requests.
 */
class DemoConnector {
    /**
     * Given a configuration in the form of a plain object, this method returns
     * a new DemoConnector instance.
     *
     * @param {Object} config
     * @returns {module:@mobify/commerce-integrations/dist/connectors/demo-connector.DemoConnector} The new DemoConnector instance.
     */
    static fromConfig(config) {
        return new this.prototype.constructor(config)
    }

    // eslint-disable-next-line no-unused-vars
    getCategory(id, opts) {
        const category = categories[id]

        return delay().then(() => {
            if (!category) {
                throw new NotFoundError('Category Not Found')
            }

            return category
        })
    }

    // eslint-disable-next-line no-unused-vars
    getProduct(id, opts) {
        const product = products[id]

        return delay().then(() => {
            if (!product) {
                throw new NotFoundError('Product Not Found')
            }

            return product
        })
    }

    // eslint-disable-next-line no-unused-vars
    searchProducts(searchParams, opts) {
        return delay().then(() => {
            const noResults = {
                query: searchParams.query,
                selectedFilters: searchParams.filters,
                results: [],
                count: 0,
                total: 0,
                start: 0
            }
            return productSearches[stringify(searchParams)] || noResults
        })
    }
}

// Demo data
const categories = (() => {
    const tShirts = {
        id: 'tshirts',
        name: 'T-Shirts',
        description: "Practical, easy-to-wear styles wherever you're headed."
    }

    const all = {
        id: 'all',
        name: 'All',
        description:
            "Hard-wearing boots, jackets and clothing for unbeatable comfort day in, day out. Practical, easy-to-wear styles wherever you're headed.",
        categories: [tShirts]
    }

    const root = {
        id: 'root',
        name: 'Home',
        categories: [all]
    }
    return Object.assign({}, ...[root, all, tShirts].map((x) => ({[x.id]: x})))
})()

const productSearches = {
    '{"filters":{"categoryId":"tshirts"},"query":""}': {
        selectedFilters: {
            categoryId: 'tshirts'
        },
        start: 0,
        total: 10,
        query: '',
        count: 6,
        results: [
            {
                available: true,
                productId: '1',
                productName: 'Mini-Logo Crew Neck T-Shirt',
                price: 20,
                defaultImage: {
                    alt: 'Mini-Logo Crew Neck T-Shirt',
                    description: 'Mini-Logo Crew Neck T-Shirt',
                    src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_sm.png`,
                    title: 'Mini-Logo Crew Neck T-Shirt'
                },
                variationProperties: [
                    {
                        id: 'color',
                        label: 'Color',
                        values: [
                            {
                                name: 'Black',
                                value: 'BLACK'
                            },
                            {
                                name: 'Grey',
                                value: 'GREY'
                            }
                        ]
                    },
                    {
                        id: 'size',
                        label: 'Size',
                        values: [
                            {
                                name: 'S',
                                value: 'SM'
                            },
                            {
                                name: 'M',
                                value: 'MD'
                            },
                            {
                                name: 'L',
                                value: 'LG'
                            }
                        ]
                    }
                ]
            },
            {
                available: true,
                productId: '2',
                productName: 'Spark-Logo Crew Neck T-Shirt',
                price: 24.99,
                defaultImage: {
                    alt: 'Spark-Logo Crew Neck T-Shirt',
                    description: 'Spark-Logo Crew Neck T-Shirt',
                    src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_sm.png`,
                    title: 'Spark-Logo Crew Neck T-Shirt'
                },
                variationProperties: [
                    {
                        id: 'color',
                        label: 'Color',
                        values: [
                            {
                                name: 'Black',
                                value: 'BLACK'
                            },
                            {
                                name: 'Grey',
                                value: 'GREY'
                            }
                        ]
                    },
                    {
                        id: 'size',
                        label: 'Size',
                        values: [
                            {
                                name: 'S',
                                value: 'SM'
                            },
                            {
                                name: 'M',
                                value: 'MD'
                            },
                            {
                                name: 'L',
                                value: 'LG'
                            }
                        ]
                    }
                ]
            },
            {
                available: true,
                productId: '3',
                productName: 'Mini-Logo Crew Neck T-Shirt',
                price: 20,
                defaultImage: {
                    alt: 'Mini-Logo Crew Neck T-Shirt',
                    description: 'Mini-Logo Crew Neck T-Shirt',
                    src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_grey_sm.png`,
                    title: 'Mini-Logo Crew Neck T-Shirt'
                },
                variationProperties: [
                    {
                        id: 'color',
                        label: 'Color',
                        values: [
                            {
                                name: 'Black',
                                value: 'BLACK'
                            },
                            {
                                name: 'Grey',
                                value: 'GREY'
                            }
                        ]
                    },
                    {
                        id: 'size',
                        label: 'Size',
                        values: [
                            {
                                name: 'S',
                                value: 'SM'
                            },
                            {
                                name: 'M',
                                value: 'MD'
                            },
                            {
                                name: 'L',
                                value: 'LG'
                            }
                        ]
                    }
                ]
            },
            {
                available: true,
                productId: '4',
                productName: 'Spark-Logo Crew Neck T-Shirt',
                price: 24.99,
                defaultImage: {
                    alt: 'Spark-Logo Crew Neck T-Shirt',
                    description: 'Spark-Logo Crew Neck T-Shirt',
                    src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_grey_sm.png`,
                    title: 'Spark-Logo Crew Neck T-Shirt'
                },
                variationProperties: [
                    {
                        id: 'color',
                        label: 'Color',
                        values: [
                            {
                                name: 'Black',
                                value: 'BLACK'
                            },
                            {
                                name: 'Grey',
                                value: 'GREY'
                            }
                        ]
                    },
                    {
                        id: 'size',
                        label: 'Size',
                        values: [
                            {
                                name: 'S',
                                value: 'SM'
                            },
                            {
                                name: 'M',
                                value: 'MD'
                            },
                            {
                                name: 'L',
                                value: 'LG'
                            }
                        ]
                    }
                ]
            },
            {
                available: true,
                productId: '5',
                productName: 'Mini-Logo Crew Neck T-Shirt',
                price: 20,
                defaultImage: {
                    alt: 'Mini-Logo Crew Neck T-Shirt',
                    description: 'Mini-Logo Crew Neck T-Shirt',
                    src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_sm.png`,
                    title: 'Mini-Logo Crew Neck T-Shirt'
                },
                variationProperties: [
                    {
                        id: 'color',
                        label: 'Color',
                        values: [
                            {
                                name: 'Black',
                                value: 'BLACK'
                            },
                            {
                                name: 'Grey',
                                value: 'GREY'
                            }
                        ]
                    },
                    {
                        id: 'size',
                        label: 'Size',
                        values: [
                            {
                                name: 'S',
                                value: 'SM'
                            },
                            {
                                name: 'M',
                                value: 'MD'
                            },
                            {
                                name: 'L',
                                value: 'LG'
                            }
                        ]
                    }
                ]
            },
            {
                available: true,
                productId: '6',
                productName: 'Spark-Logo Crew Neck T-Shirt',
                price: 24.99,
                defaultImage: {
                    alt: 'Spark-Logo Crew Neck T-Shirt',
                    description: 'Spark-Logo Crew Neck T-Shirt',
                    src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_sm.png`,
                    title: 'Spark-Logo Crew Neck T-Shirt'
                },
                variationProperties: [
                    {
                        id: 'color',
                        label: 'Color',
                        values: [
                            {
                                name: 'Black',
                                value: 'BLACK'
                            },
                            {
                                name: 'Grey',
                                value: 'GREY'
                            }
                        ]
                    },
                    {
                        id: 'size',
                        label: 'Size',
                        values: [
                            {
                                name: 'S',
                                value: 'SM'
                            },
                            {
                                name: 'M',
                                value: 'MD'
                            },
                            {
                                name: 'L',
                                value: 'LG'
                            }
                        ]
                    }
                ]
            }
        ],
        sortingOptions: [
            {
                id: 'price-low-to-high',
                label: 'Price Low To High'
            },
            {
                id: 'price-high-to-low',
                label: 'Price High To Low'
            },
            {
                id: 'name-ascending',
                label: 'Name (A-Z)'
            },
            {
                id: 'name-descending',
                label: 'Name (Z-A)'
            }
        ],
        filters: []
    }
}

const products = {
    '1': {
        id: '1',
        name: 'Mini-Logo Crew Neck T-Shirt',
        description: '',
        price: 20,
        minimumOrderQuantity: 1,
        imageSets: [
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_grey_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_grey_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, swatch',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_black.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, swatch',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_grey.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            }
        ],
        variationValues: {},
        stepQuantity: 1,
        categoryId: 'tshirts',
        variations: [
            {
                id: '1001',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'SM'
                }
            },
            {
                id: '1002',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'MD'
                }
            },
            {
                id: '1003',
                price: 20,
                orderable: false,
                values: {
                    color: 'BLACK',
                    size: 'LG'
                }
            },
            {
                id: '1004',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'SM'
                }
            },
            {
                id: '1005',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'MD'
                }
            },
            {
                id: '1006',
                price: 20,
                orderable: false,
                values: {
                    color: 'GREY',
                    size: 'LG'
                }
            }
        ],
        variationProperties: [
            {
                id: 'color',
                label: 'Color',
                values: [
                    {
                        name: 'Black',
                        value: 'BLACK'
                    },
                    {
                        name: 'Grey',
                        value: 'GREY'
                    }
                ]
            },
            {
                id: 'size',
                label: 'Size',
                values: [
                    {
                        name: 'S',
                        value: 'SM'
                    },
                    {
                        name: 'M',
                        value: 'MD'
                    },
                    {
                        name: 'L',
                        value: 'LG'
                    }
                ]
            }
        ]
    },
    '2': {
        id: '2',
        name: 'Spark-Logo Crew Neck T-Shirt',
        description: '',
        price: 24.99,
        minimumOrderQuantity: 1,
        imageSets: [
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_grey_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_grey_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, swatch',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_black.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, swatch',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_grey.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            }
        ],
        variationValues: {},
        stepQuantity: 1,
        categoryId: 'tshirts',
        variations: [
            {
                id: '2001',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'SM'
                }
            },
            {
                id: '2002',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'MD'
                }
            },
            {
                id: '2003',
                price: 20,
                orderable: false,
                values: {
                    color: 'BLACK',
                    size: 'LG'
                }
            },
            {
                id: '2004',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'SM'
                }
            },
            {
                id: '2005',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'MD'
                }
            },
            {
                id: '2006',
                price: 20,
                orderable: false,
                values: {
                    color: 'GREY',
                    size: 'LG'
                }
            }
        ],
        variationProperties: [
            {
                id: 'color',
                label: 'Color',
                values: [
                    {
                        name: 'Black',
                        value: 'BLACK'
                    },
                    {
                        name: 'Grey',
                        value: 'GREY'
                    }
                ]
            },
            {
                id: 'size',
                label: 'Size',
                values: [
                    {
                        name: 'S',
                        value: 'SM'
                    },
                    {
                        name: 'M',
                        value: 'MD'
                    },
                    {
                        name: 'L',
                        value: 'LG'
                    }
                ]
            }
        ]
    },
    '3': {
        id: '3',
        name: 'Mini-Logo Crew Neck T-Shirt',
        description: '',
        price: 20,
        minimumOrderQuantity: 1,
        imageSets: [
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_grey_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_grey_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, swatch',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_black.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, swatch',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_grey.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            }
        ],
        variationValues: {},
        stepQuantity: 1,
        categoryId: 'tshirts',
        variations: [
            {
                id: '1001',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'SM'
                }
            },
            {
                id: '1002',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'MD'
                }
            },
            {
                id: '1003',
                price: 20,
                orderable: false,
                values: {
                    color: 'BLACK',
                    size: 'LG'
                }
            },
            {
                id: '1004',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'SM'
                }
            },
            {
                id: '1005',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'MD'
                }
            },
            {
                id: '1006',
                price: 20,
                orderable: false,
                values: {
                    color: 'GREY',
                    size: 'LG'
                }
            }
        ],
        variationProperties: [
            {
                id: 'color',
                label: 'Color',
                values: [
                    {
                        name: 'Black',
                        value: 'BLACK'
                    },
                    {
                        name: 'Grey',
                        value: 'GREY'
                    }
                ]
            },
            {
                id: 'size',
                label: 'Size',
                values: [
                    {
                        name: 'S',
                        value: 'SM'
                    },
                    {
                        name: 'M',
                        value: 'MD'
                    },
                    {
                        name: 'L',
                        value: 'LG'
                    }
                ]
            }
        ]
    },
    '4': {
        id: '4',
        name: 'Spark-Logo Crew Neck T-Shirt',
        description: '',
        price: 24.99,
        minimumOrderQuantity: 1,
        imageSets: [
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_grey_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_grey_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, swatch',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_black.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, swatch',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_grey.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            }
        ],
        variationValues: {},
        stepQuantity: 1,
        categoryId: 'tshirts',
        variations: [
            {
                id: '2001',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'SM'
                }
            },
            {
                id: '2002',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'MD'
                }
            },
            {
                id: '2003',
                price: 20,
                orderable: false,
                values: {
                    color: 'BLACK',
                    size: 'LG'
                }
            },
            {
                id: '2004',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'SM'
                }
            },
            {
                id: '2005',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'MD'
                }
            },
            {
                id: '2006',
                price: 20,
                orderable: false,
                values: {
                    color: 'GREY',
                    size: 'LG'
                }
            }
        ],
        variationProperties: [
            {
                id: 'color',
                label: 'Color',
                values: [
                    {
                        name: 'Black',
                        value: 'BLACK'
                    },
                    {
                        name: 'Grey',
                        value: 'GREY'
                    }
                ]
            },
            {
                id: 'size',
                label: 'Size',
                values: [
                    {
                        name: 'S',
                        value: 'SM'
                    },
                    {
                        name: 'M',
                        value: 'MD'
                    },
                    {
                        name: 'L',
                        value: 'LG'
                    }
                ]
            }
        ]
    },
    '5': {
        id: '5',
        name: 'Mini-Logo Crew Neck T-Shirt',
        description: '',
        price: 20,
        minimumOrderQuantity: 1,
        imageSets: [
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_black_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_grey_xl.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    },
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_logo_grey_model_xl.jpg`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Black, swatch',
                        description: 'Mini-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_black.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            },
            {
                images: [
                    {
                        alt: 'Mini-Logo Crew Neck T-Shirt, Grey, swatch',
                        description: 'Mini-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_grey.png`,
                        title: 'Mini-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            }
        ],
        variationValues: {},
        stepQuantity: 1,
        categoryId: 'tshirts',
        variations: [
            {
                id: '1001',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'SM'
                }
            },
            {
                id: '1002',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'MD'
                }
            },
            {
                id: '1003',
                price: 20,
                orderable: false,
                values: {
                    color: 'BLACK',
                    size: 'LG'
                }
            },
            {
                id: '1004',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'SM'
                }
            },
            {
                id: '1005',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'MD'
                }
            },
            {
                id: '1006',
                price: 20,
                orderable: false,
                values: {
                    color: 'GREY',
                    size: 'LG'
                }
            }
        ],
        variationProperties: [
            {
                id: 'color',
                label: 'Color',
                values: [
                    {
                        name: 'Black',
                        value: 'BLACK'
                    },
                    {
                        name: 'Grey',
                        value: 'GREY'
                    }
                ]
            },
            {
                id: 'size',
                label: 'Size',
                values: [
                    {
                        name: 'S',
                        value: 'SM'
                    },
                    {
                        name: 'M',
                        value: 'MD'
                    },
                    {
                        name: 'L',
                        value: 'LG'
                    }
                ]
            }
        ]
    },
    '6': {
        id: '6',
        name: 'Spark-Logo Crew Neck T-Shirt',
        description: '',
        price: 24.99,
        minimumOrderQuantity: 1,
        imageSets: [
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_black_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_grey_xl.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    },
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, large',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/shirt_spark_grey_model_xl.jpg`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'large'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Black, swatch',
                        description: 'Spark-Logo Crew Neck T-Shirt, Black',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_black.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Black'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'BLACK'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            },
            {
                images: [
                    {
                        alt: 'Spark-Logo Crew Neck T-Shirt, Grey, swatch',
                        description: 'Spark-Logo Crew Neck T-Shirt, Grey',
                        src: `https://s3.amazonaws.com/scaffold-pwa-assets/images/swatch_grey.png`,
                        title: 'Spark-Logo Crew Neck T-Shirt, Grey'
                    }
                ],
                variationProperties: [
                    {
                        id: 'color',
                        values: [
                            {
                                value: 'GREY'
                            }
                        ]
                    }
                ],
                sizeType: 'swatch'
            }
        ],
        variationValues: {},
        stepQuantity: 1,
        categoryId: 'tshirts',
        variations: [
            {
                id: '2001',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'SM'
                }
            },
            {
                id: '2002',
                price: 20,
                orderable: true,
                values: {
                    color: 'BLACK',
                    size: 'MD'
                }
            },
            {
                id: '2003',
                price: 20,
                orderable: false,
                values: {
                    color: 'BLACK',
                    size: 'LG'
                }
            },
            {
                id: '2004',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'SM'
                }
            },
            {
                id: '2005',
                price: 20,
                orderable: true,
                values: {
                    color: 'GREY',
                    size: 'MD'
                }
            },
            {
                id: '2006',
                price: 20,
                orderable: false,
                values: {
                    color: 'GREY',
                    size: 'LG'
                }
            }
        ],
        variationProperties: [
            {
                id: 'color',
                label: 'Color',
                values: [
                    {
                        name: 'Black',
                        value: 'BLACK'
                    },
                    {
                        name: 'Grey',
                        value: 'GREY'
                    }
                ]
            },
            {
                id: 'size',
                label: 'Size',
                values: [
                    {
                        name: 'S',
                        value: 'SM'
                    },
                    {
                        name: 'M',
                        value: 'MD'
                    },
                    {
                        name: 'L',
                        value: 'LG'
                    }
                ]
            }
        ]
    }
}
