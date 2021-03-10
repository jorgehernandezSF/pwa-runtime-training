const CAROUSEL_IMAGE_SIZE_TYPE = 'large'
const CAROUSEL_VARIATION_PROPERTY_VARIATION = 'color'

export const parseProduct = (product) => {
    product.allImages = []

    // Expand imageSet for easier filtering
    product.imageGroups.forEach((imageGroup) => {
        const {images, viewType, variationAttributes} = imageGroup
        imageGroup.sizeType = viewType
        imageGroup.variationProperties = variationAttributes
        images.forEach((image) => {
            product.allImages.push({
                ...image,
                sizeType: viewType,
                variationProperties: variationAttributes
            })
        })
        delete imageGroup.viewType
        delete imageGroup.variationAttributes
    })

    // Inject [swatches|orderable] into variation property.
    product.variationProperties = product.variationAttributes
    delete product.variationAttributes
    product.variationProperties.map((variationProperty) => {
        const {id, name, values} = variationProperty

        variationProperty.label = name

        return values.map((variation) => {
            // Find image for variation
            const matchingSwatchImages = product.allImages.filter(
                (image) =>
                    image.sizeType === 'swatch' &&
                    (image.variationProperties || []).find((v) => {
                        return v.id === id && v.values.find((vv) => vv.value === variation.value)
                    })
            )

            // Find if variation is orderable
            const orderableVariations = (product.variants || []).filter(
                (v) => v.variationValues[id] === variation.value && v.orderable
            )

            // Set [swatches|orderable] onto variation property.
            if (matchingSwatchImages.length > 0) {
                variation.swatches = matchingSwatchImages
            }
            variation.label = variation.name
            variation.orderable = !!orderableVariations.length
            return variation
        })
    })
    return product
}

export const getCarouselImages = (product, variationValues = {}) => {
    if (!product.allImages || product.allImages.length < 1) return []
    const selected = variationValues[CAROUSEL_VARIATION_PROPERTY_VARIATION]

    const carouselImages = product.allImages.filter((image) => {
        return image.sizeType === CAROUSEL_IMAGE_SIZE_TYPE || image.sizeType === 'default'
    })

    // Show all large images if no selected variation
    if (!selected) return carouselImages

    // Filter large images for selected variation
    const fullImages = carouselImages.filter((image) => {
        /* istanbul ignore next */
        const validVariationPropertyToShow =
            (image.variationProperties || []).find(
                (variationProperty) =>
                    variationProperty.id === CAROUSEL_VARIATION_PROPERTY_VARIATION
            ) || {}
        return (validVariationPropertyToShow.values || []).find((v) => v.value === selected)
    })

    return fullImages
}
