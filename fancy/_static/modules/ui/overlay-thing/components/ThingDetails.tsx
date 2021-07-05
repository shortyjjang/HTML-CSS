import React, { Component } from 'react';
import classnames from 'classnames';
import { cdnUtils, renderPopup } from 'fancyutils';
import { Display } from 'fancymixin';

import {
    getDescription,
    getSales,
    getDomesticDeliveryDate,
    getIntlDeliveryDate,
    getSaleImages,
} from './map';
import { getCountryByCode } from '../data/Countries';
import { StaticThingViewConfig } from '../config';
import { getCurrentSaleOption } from './map';

const { ThumbnailsLimit } = StaticThingViewConfig;


export class ItemDetail extends Component {
    DetailHeight = 175;
    constructor(props) {
        super(props);
        this.state = {
            showMore: false,
            shortDescription: false
        };
    }

    handlePolicyDislplay = (event) => {
        event.preventDefault();
        const { thing: { sales }} = this.props;
        if (sales) {
            import(/* webpackChunkName: "OverlayThing.popup" */'./popup/index')
            .then(({ ReturnPolicyDetailPopup }) => {
                renderPopup(ReturnPolicyDetailPopup, { sales });
            });
        }
    }

    handleMore = (event) => {
        event.preventDefault();
        this.setState({ showMore: true });
    }

    handleLess = (event) => {
        event.preventDefault();
        this.setState({ showMore: false });
    }

    handleViewAllImages = () => {
        this.props.onThumbnailsLimitChange(ThumbnailsLimit.More);
    }
/*
    handleCheckArea(event) {
        // TODO: check log in
        event.preventDefault();
    }
*/
    handleSelectImage = (event) => {
        event.preventDefault();
        const idx = parseInt($(event.currentTarget).attr('data-idx'));
        const saleOptionID = parseInt($(event.currentTarget).closest('li').attr('data-option-id')) || undefined;
        this.props.handleChangeFigure(idx, saleOptionID);
    }

    setDescriptionDisplayState = () => {
        const detailRef = $(this.detail);
        var shortDescription;
        if (detailRef.length > 0) {
            // Get some of very first two children, which is not 'more' or 'less'
            shortDescription = detailRef.children()
                                        .filter(i => i <= 1)
                                        .toArray()
                                        .reduce((p, n) => p + $(n).outerHeight(), 0) < this.DetailHeight;
        } else {
            shortDescription = false;
        }
        this.props.onThumbnailsLimitChange(ThumbnailsLimit.Basic);
        this.setState({
            shortDescription,
            showMore: false,
        });
    }

    componentDidMount() {
        this.setDescriptionDisplayState();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.appContext.lastFullyRenderedThingID !==
            this.props.appContext.lastFullyRenderedThingID
        ) {
            this.setDescriptionDisplayState();
        }
    }

    render () {
        const {
            //appContext: { userCountry },
            thing,
            thing: { META },
            type,
            slideContext: { thumbnailIndex },
            thumbnailsLimit, 
            saleContext
        } = this.props;
        const { shortDescription, showMore } = this.state;

        const sales = getSales(type, thing);
        const option = getCurrentSaleOption(sales, saleContext, true);

        const saleImages = getSaleImages(thing, option, thumbnailsLimit);

        if (type === 'urlOnly') {
            if(thing.user){
                return (
                    <div className="figure-detail after" key="thing-figure-detail" style={Display.NoneIf(thing.loading)}>
                        <p className="asset">
                            {gettext("Added by ")}
                            <a href={thing.user.html_url} target="_blank">
                                {thing.user.full_name}
                            </a>
                        </p>
                    </div>
                );
            } else {
                return null;
            }
        }

        return (
            <div className="figure-detail after" key="thing-figure-detail" style={Display.NoneIf(thing.loading)}>
                <div className="thumbnail-list">
                    <ul className="after">
                        {saleImages
                            .map((image, idx) => {
                                const thumbIsVideo = image.thumbType === 'video';
                                const thumbnailURL = (thumbIsVideo || META.Hotel) ? image.src : cdnUtils.getResizeURL(image.src, 100, 'crop', true, true);
                                const optionProps = {};
                                if (image.option_name) {
                                    optionProps['data-option-name'] = image.option_name;
                                }
                                if (image.option_id) {
                                    optionProps['data-option-id'] = image.option_id;
                                }
                                return (
                                    <li key={idx} className={thumbnailIndex === idx ? 'current' : null} {...optionProps}>
                                        <a data-idx={idx}
                                           style={{ backgroundImage: `url(${thumbnailURL})`}}
                                           className={classnames("thumb", { "active": thumbnailIndex === idx, "video-thumb": thumbIsVideo })}
                                           onClick={this.handleSelectImage}
                                        />
                                    </li>
                                );
                            })
                        }
                        {(saleImages.length >= thumbnailsLimit) &&
                            <li>
                                <a className="more" onClick={this.handleViewAllImages}>{gettext("View all images")}</a>
                            </li>
                        }
                    </ul>
                </div>
                <div className="description">
                    <div className={classnames("detail", { 'show': showMore, 'short': shortDescription })} ref={(element) => {this.detail = element;}}>
                        <h4 className="tit">{gettext('Description')}</h4>
                        <div dangerouslySetInnerHTML={{ __html: getDescription(type, thing) }}/>
                        <a onClick={this.handleMore} className="more">{gettext("Show More")}</a>
                        <a onClick={this.handleLess} className="less">{gettext("Show Less")}</a>
                    </div>
                    {(type === 'sales') &&
                        <ul className="after">
                            {/*sales.available_for_sameday_shipping &&
                                <li>
                                    <label>{gettext('Same-Day Delivery')}</label>
                                    <span className="same-delivery">
                                        <i className="icon"></i>{gettext('Get it delivered today.')}
                                        <a onClick={this.handleCheckArea}
                                           className="same-day-shipping-pop"> {gettext('Check your area')}
                                        </a>
                                    </span>
                                </li>
                            */}
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

export class DeliveryInformation extends Component {
    handleShipCountryClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const { appContext: { userCountry }, dispatch } = this.props;
        import(/* webpackChunkName: "OverlayThing.popup" */'./popup/index')
            .then(({ ShippingCountriesPopup }) => {
                renderPopup(ShippingCountriesPopup, { dispatch, userCountry });
            });
    };

    render() {
        const { appContext: { userCountry }, thing, type } = this.props;

        const sales = getSales(type, thing);
        const deliveryIsDomestic = sales && userCountry === 'US';
        const ableToShip = (deliveryIsDomestic && sales.expected_delivery_day_1) ||
                           userCountry !== 'US' && sales.international_shipping;
        const hideShippingWindow = deliveryIsDomestic && !sales.expected_delivery_day_1;

        var deliveryDate;
        if (ableToShip) {
            if (deliveryIsDomestic) {
                deliveryDate = getDomesticDeliveryDate(sales)
            } else {
                deliveryDate = getIntlDeliveryDate(sales)
            }
        }

        return <li className={`${deliveryIsDomestic ? 'domestic' : 'international'} shipping`}
                   style={Display.NoneIf(!ableToShip)}>
            <label>{deliveryDate ? gettext('Estimated Delivery') : gettext('Delivery')}</label>
            <span className="able" style={Display.NoneIf(!ableToShip)}>
                {deliveryDate ? `${deliveryDate} days to ` : 'Ships to '}
                <a onClick={this.handleShipCountryClick}>{getCountryByCode(userCountry)}</a>
            </span>
            <span className="unable" style={Display.NoneIf(ableToShip || hideShippingWindow)}>
                Unable to ship to <a onClick={this.handleShipCountryClick}>{userCountry}</a>
            </span>
        </li>
    }
}
