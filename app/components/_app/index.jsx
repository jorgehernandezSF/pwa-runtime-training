import React, {useState, useEffect} from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import {useCommerceAPI} from '../../commerce-api/utils'
import SkipLinks from 'pwa-kit-react-sdk/dist/components/skip-links'
import {pages, PAGEEVENTS} from 'pwa-kit-react-sdk/dist/ssr/universal/events'
import {PAGEVIEW, ERROR, OFFLINE} from 'pwa-kit-react-sdk/dist/analytics-integrations/types'
import {getAssetUrl} from 'pwa-kit-react-sdk/dist/ssr/universal/utils'

import {watchOnlineStatus} from '../../utils/utils'
import Header from '../../components/header'
import Footer from '../../components/footer'
import OfflineBoundary from '../../components/offline-boundary'
import ResponsiveContainer from '../../components/responsive-container'
import ScrollToTop from '../../components/scroll-to-top'

import {getAnalyticsManager} from '../../analytics'
import {getNavigationRoot, getNavigationRootDesktop, flattenCategory} from './helpers'
const analyticsManager = getAnalyticsManager()

const ROOT_CATEGORY_ID = 'root'

export const OfflineBanner = () => (
    <header className="c-app__offline-banner">
        <p>Currently browsing in offline mode</p>
    </header>
)

const App = (props) => {
    const {children} = props

    const navigationRootMobile = getNavigationRoot(props)
    const navigationRootDesktop = getNavigationRootDesktop(props)

    const commerceAPI = useCommerceAPI()
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        // The CommerceAPI will log in automatically upon making the first request on
        // the server and client. However, we're calling it here explicitly upon mount
        // to avoid delays. Note that this only applies to mounting on the client side.
        // This hook is not run during SSR...in that case its ok to just rely on the
        // api to implicitly log us in.
        commerceAPI.login()

        // Listen for events from the SDK to send analytics for.
        pages.on(PAGEEVENTS.PAGELOAD, (evt) => {
            analyticsManager.track(PAGEVIEW, evt)
            analyticsManager.trackPageLoad(evt)
        })
        pages.on(PAGEEVENTS.ERROR, (evt) => {
            analyticsManager.track(ERROR, evt)
        })

        // Listen for online status changes to update state and send analytics for.
        watchOnlineStatus((isOnline) => {
            setIsOnline(isOnline)

            analyticsManager.track(OFFLINE, {
                startTime: !isOnline ? new Date().getTime() : null
            })
        })
    }, [])

    return (
        <ResponsiveContainer>
            <Helmet>
                <meta name="theme-color" content="#0288a7" />
                <meta name="apple-mobile-web-app-title" content="Scaffold" />
                <link
                    rel="apple-touch-icon"
                    href={getAssetUrl('static/img/global/apple-touch-icon.png')}
                />
                <link rel="manifest" href={getAssetUrl('static/manifest.json')} />
            </Helmet>

            <ScrollToTop />

            <div id="app" className="c-app">
                <SkipLinks
                    items={[
                        {target: '#app-main', label: 'Skip to content'} // See: https://www.w3.org/TR/WCAG20-TECHS/G1.html
                    ]}
                />

                <Header
                    navigationRootMobile={navigationRootMobile}
                    navigationRootDesktop={navigationRootDesktop}
                />

                {!isOnline && <OfflineBanner />}

                <main id="app-main" className="c-app__main" role="main">
                    <div className="c-app__content">
                        <OfflineBoundary isOnline={isOnline}>{children}</OfflineBoundary>
                    </div>
                </main>

                <Footer />
            </div>
        </ResponsiveContainer>
    )
}

App.shouldGetProps = () => {
    // In this case, we only want to fetch data for the app once, on the server.
    return typeof window === 'undefined'
}

App.getProps = async ({api}) => {
    const rootCategory = await api.shopperProducts.getCategory({
        parameters: {
            id: ROOT_CATEGORY_ID,
            levels: 4
        }
    })
    return {categories: flattenCategory(rootCategory)}
}

App.propTypes = {
    children: PropTypes.node,
    categories: PropTypes.object
}

export default App
