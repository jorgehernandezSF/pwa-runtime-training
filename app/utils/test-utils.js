import React from 'react'
import {mount} from 'enzyme'
import {BrowserRouter as Router} from 'react-router-dom'
import CommerceAPI from '../commerce-api'
import {CommerceAPIProvider} from '../commerce-api/utils'
import {commerceAPIConfig} from '../commerce-api.config'

export const mountWithRouter = (node) => mount(<Router>{node}</Router>)

export const mountWithRouterAndCommerceAPI = (node) => {
    const api = new CommerceAPI({...commerceAPIConfig, proxy: undefined})
    return mount(
        <CommerceAPIProvider value={api}>
            <Router>{node}</Router>
        </CommerceAPIProvider>
    )
}
