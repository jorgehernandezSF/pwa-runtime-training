import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
//import { ListTile, Button } from '@chakra-ui/react'

class ProductDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShippingSheetOpen: false,
            isSubscribed: false,
            variationValues: {}
        }
    }

    static getTemplateName() {
        return 'exampleProductDetails'
    }

    static shouldGetProps({ previousParams, params }) {
        return !previousParams || previousParams.productId !== params.productId
    }

    static async getProps({ params, api }) {

        await api.auth.login()

        const product = await api.shopperProducts.getProduct({
            parameters: { id: "25752986M", allImages: true }
        })

        debugger
        return { product: product, promotions: product.productPromotions }
    }

    render() {
        let product = this.props.product
        let promotions = this.props.promotions

        return (
            <div className="t-product-details" itemScope itemType="http://schema.org/Product">

                <h1>Why does this show? {product.name}</h1>
                {product && (
                    <Helmet>
                        <title>{product.name}</title>
                        <meta name="description" content={product.name} />
                    </Helmet>
                )}

                {promotions &&
                    promotions.map(({ promotionId, calloutMsg }) => (
                        <h1 key={promotionId}>{calloutMsg}</h1>
                    ))
                }

                {/* <ListTile className="pw--instructional-block">
                        <div className="u-margin-bottom-lg">Set up a modal with with example:</div>

                        <Button
                            className="t-product-details__modal-button pw--primary qa-modal-button"
                            onClick={this.toggleShippingSheet.bind(this)}
                        >
                            Modal Button
                        </Button>
                    </ListTile> */}
            </div >
        )
    }
}

ProductDetails.propTypes = {
    errorMessage: PropTypes.string,
    params: PropTypes.object,
    product: PropTypes.object,
    trackPageLoad: PropTypes.func
}

export default ProductDetails
