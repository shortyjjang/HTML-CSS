import React, { Component } from 'react';
import { isPlainLeftClick } from 'fancyutils';

import { LinkTypes, transition } from '../container/routeutils';


export default class ArticleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleLinkClick = _.throttle(this.handleLinkClick, 500);
    }

    handleLinkClick = (event) => {
        event.stopPropagation();
        if (isPlainLeftClick(event)) {
            event.preventDefault();

            const { html_url } = this.props;
            transition(html_url, LinkTypes.Timeline);
        }
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        const { id, cover_image, title, url, tagline } = this.props;
        
        return (
            <div className="article_item detail">
              <a href={url} >
                <span className="cover">
                  { cover_image &&
                  <img src="/_ui/images/common/blank.gif" style={{backgroundImage: `url(${cover_image.url})`}}/>
                  }
                  { !cover_image &&
                    <img src="/_ui/images/common/blank.gif"/>
                  }
                </span>
                <span className="title">{title}</span>
                <span className="description">{tagline}</span>
              </a>
            </div>
        );
    }
}