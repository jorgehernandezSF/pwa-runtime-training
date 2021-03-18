/* eslint-disable react/prop-types */
import React from 'react'
import fetch from 'cross-fetch'
import {getProtocolHostAndPort} from '../../commerce-api/utils'
import {HTTPError} from 'pwa-kit-react-sdk/dist/ssr/universal/errors'

const ContentDetails = ({content, error}) => {
    if (error) {
        return <div>{error.fault.message}</div>
    }

    if (!content) {
        return <div>Loading...</div>
    }

    return <div dangerouslySetInnerHTML={{__html: content.c_body}} />
 }

ContentDetails.getProps = async ({params, res}) => {
    let content, error
    const result = await fetch (
        // `http://localhost:3000/mobify/proxy/ocapi/s/RefArch/dw/shop/v20_10/content/${params.id}?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
        `${getProtocolHostAndPort()}/mobify/proxy/ocapi/s/RefArch/dw/shop/v20_4/content/${params.id}?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
    )

    if (result.ok) {
        content = await result.json()
    } else {
        error = await result.json()
        res.status(result.status)
    }

   return {content, error}
}

export default ContentDetails