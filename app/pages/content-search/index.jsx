import React from 'react'
import fetch from 'cross-fetch'
import List from 'pwa-kit-react-sdk/dist/components/list'
import ListTile from 'pwa-kit-react-sdk/dist/components/list-tile'
import {getProtocolHostAndPort} from '../../commerce-api/utils'

const ContentSearch = ({contentResult}) => {
    if (!contentResult) {
        return <div>Loading...</div>
    }
    const {hits = []} = contentResult

    return (
        <div>
            <h1>Search Results</h1>
            {hits.length ? (
                <List>
                    {hits.map(({id, name}) => (
                        <ListTile key={id} href={`/content/${id}`}>
                            {name}
                        </ListTile>
                    ))}
                </List>
            ) : (
                <div>No Content Items Found!</div>
            )}
        </div>
    )
}

ContentSearch.getTemplateName = () => 'content-search';

ContentSearch.getProps = async () => {
    let contentResult
    const res = await fetch(
        `http://localhost:3000/mobify/proxy/ocapi/s/RefArch/dw/shop/v20_2/content_search?q=about&client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
        //`${getProtocolHostAndPort()}/mobify/proxy/ocapi/s/RefArch/dw/shop/v20_4/content_search?q=about&client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
    )

    if (res.ok) {
        contentResult = await res.json()
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log(contentResult)
    }

    return {contentResult}
}

export default ContentSearch;