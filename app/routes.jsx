import React from 'react'
import loadable from '@loadable/component'
import SkeletonBlock from 'pwa-kit-react-sdk/dist/components/skeleton-block'

const fallback = <SkeletonBlock height="100%" width="100%" />

const Home = loadable(() => import('./pages/home'), {fallback})
const ProductList = loadable(() => import('./pages/product-list'), {fallback})
const ProductDetails = loadable(() => import('./pages/product-details'), {fallback})
const ContentSearch = loadable(() => import('./pages/content-search'), {fallback})
const ContentDetails = loadable(() => import('./pages/content-details'), {fallback})

const routes = [
    {
        path: '/content/:id',
        component: ContentDetails
    },
    {
        path: '/content-search',
        component: ContentSearch
    },
    {
        path: '/category/:categoryId',
        component: ProductList
    },
    {
        path: '/products/:productId',
        component: ProductDetails
    },
    {
        path: '/',
        component: Home,
        exact: true
    }
]

export default routes
