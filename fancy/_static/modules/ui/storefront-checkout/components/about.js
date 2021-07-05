import React from "react";


export const About = ({ appContext: { seller } }) => (
    <div id="about">
        <a href={seller.store_url}>
            <span className="logo" style={{backgroundImage: `url(${seller.logo_url})`}}></span>
            <h1><span dangerouslySetInnerHTML={{__html:seller.brand_name}}/> <small>{seller.store_url_simple}</small></h1>
        </a>
    </div>
)
