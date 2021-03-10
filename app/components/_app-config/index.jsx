import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import CommerceAPI from '../../commerce-api'
import {CommerceAPIProvider} from '../../commerce-api/utils'
import {commerceAPIConfig} from '../../commerce-api.config'

/**
 * Use the AppConfig component to inject extra arguments into the getProps
 * methods for all Route Components in the app – typically you'd want to do this
 * to inject a connector instance that can be used in all Pages.
 *
 * You can also use the AppConfig to configure a state-management library such
 * as Redux, or Mobx, if you like.
 */
const AppConfig = (props) => {
    return (
        <CommerceAPIProvider value={AppConfig.api}>
            <Fragment>{props.children}</Fragment>
        </CommerceAPIProvider>
    )
}

AppConfig.restore = () => {
    AppConfig.api = new CommerceAPI(commerceAPIConfig)
}

AppConfig.freeze = () => undefined

AppConfig.extraGetPropsArgs = () => {
    return {
        api: AppConfig.api
    }
}

AppConfig.propTypes = {
    children: PropTypes.node
}

export default AppConfig
