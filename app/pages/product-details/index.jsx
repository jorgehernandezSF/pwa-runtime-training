import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import getIdsFromArrayOfObject from '../../utils/utils'
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

        getIdsFromArrayOfObject(product.productPromotions, "promotionId")

        // Get the promotions for the product
        const promotions = await api.shopperPromotions.getPromotions({
            parameters: { ids: product.productPromotions[0].promotionId }
        })

        //Notice that I return the tooltipContent
        return {
            product: product,
            promotions: product.productPromotions,
            tooltipContent: promotions.data[0].details }
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
                    promotions.map(({ promotionId, calloutMsg }) => (
                        <Tooltip
                            key={promotionId}
                            label={tooltipContent || <Spinner />}
                            aria-label="Promotion details"
                        >
                            <Text>{calloutMsg}</Text>
                        </Tooltip>
                    ))}
                <br></br>

                {/* upon hover on a promotion
                1a. open a tooltip, initially show the data we have: the promotionID
                onOpen check state set, call intermediate function
                make call
                spinner
                show details
                1b. add event handler that calls the shopperPromotions.getPromotion API which needs the promotionID (see above in getProps for an example of the call)
                   const product = await api.shopperPromotions.getPromotions({
                        parameters: {ids: promotionId}
                    })
                2. Replace the tooltip with the details returned.
                */}
                {/* {tooltipContent &&
                    <h1>This is the tooltip content: {tooltipContent}</h1>
                } */}
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
