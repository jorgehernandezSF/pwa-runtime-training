import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {pluckIds} from '../../utils/utils'
import {
    Tooltip,
    Spinner,
    Text
} from '@chakra-ui/react'


const promotionTooltip = () => {
    const [promotionDetails, setPromotionDetails] = useState()
    const onHoverHandler = () => {
        if (promotionDetails) {
            return
        }
        const getPromotionDetails = async () => {
            // api will have to be created before have because we aren't in `getProps`
            const promotion = await api.shopperPromotions.getPromotions({
                parameters: { ids: product.productPromotions[0].promotionId }
            })
            setPromotionDetails(promotion.details)
        }
        getPromotionDetails()
    }
    return (
        <div>
            <Tooltip label={promotionDetails || <Spinner />} onOpen={onHoverHandler}>
                <Text>Show Promo</Text>
            </Tooltip>
        </div>
    )
}


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

        const product = await api.shopperProducts.getProduct({
            parameters: { id: params.productId, allImages: true }
        })

        const promotionIds = pluckIds(product.productPromotions, "promotionId")

        // Get the promotions for the product
        const promotions = await api.shopperPromotions.getPromotions({
            parameters: {ids: promotionIds}
        })

        //Notice that I return the tooltipContent
        return {
            product: product,
            promotions: promotions.data,
            tooltipContent: promotions.data[0].details
        }
    }

    render() {
        let product = this.props.product
        let promotions = this.props.promotions
        let tooltipContent = this.props.tooltipContent

        return (
            <div className="t-product-details" itemScope itemType="http://schema.org/Product">

                <h1>This is the product: {product.name}</h1>
                <br></br>
                {product && (
                    <Helmet>
                        <title>{product.name}</title>
                        <meta name="description" content={product.name} />
                    </Helmet>
                )}

                <h2>These are the promotions (if any):</h2>
                {promotions &&
                    promotions.map(({id, calloutMsg, details}) => (
                        <Tooltip key={id} label={details} aria-label="Promotion details">
                            <Text>{calloutMsg}</Text>
                        </Tooltip>
                    ))}
            </div>
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
