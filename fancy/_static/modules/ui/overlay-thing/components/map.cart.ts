import { getLocationArgPairs } from 'fancyutils';
import { GlobalFancySomething } from 'ftypes';


declare global {
    interface Window {
        _: typeof import('underscore');
        track_event: Function;
        alertify: alertify.IAlertifyStatic;
        dataLayer: Array<any>;
        Fancy: GlobalFancySomething;
        from_sds_page: boolean;
        TrackingEvents: {
            addToCart(_: any): any
        }
    }
}

const { Fancy, track_event, dataLayer, from_sds_page, TrackingEvents } = window;

export function logAddCartMixpanel({
    salesID,
    saleOptionID,
    utm,
    section,
    via,
} : {
    salesID: any;
    saleOptionID: any;
    utm: any;
    section: any;
    via: any;
}) {
    if (salesID == null) {
        return;
    }
    if (utm == null) {
        const currentLocationArgPair = getLocationArgPairs('utm');
        if (currentLocationArgPair) {
            utm = currentLocationArgPair[1];
        }
    }
    const log = {
        'sale id': salesID,
        via: via || 'thing page',
        utm: utm,
    };
    if (section) {
        log.section = section;
    }
    if (saleOptionID && salesID !== saleOptionID) {
        log['option id'] = saleOptionID;
    }
    try {
        window.track_event && track_event('Add to Cart', log);
    } catch (e) {}
    return log;
}

export function addItemToCart(param, callback, meta) {
    // should be replaced by Fancy.CartAPI.addItem
    param.from_sds_page = from_sds_page;
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'Add_to_Cart_Button',
            product_id: param['sale_item_id'],
            option_id: param['option_id'],
            products: undefined,
            products_info: undefined,
            revenue: undefined
        });
    }
    return $.ajax({
        type: 'POST',
        url: '/add_item_to_cart.json',
        data: param
    })
    .done(json => {
        if (!json || json.status_code == null) {
            return;
        }
        if (json.status_code === 1) {
            if (meta) {
                TrackingEvents.addToCart([{
                    id: param.sale_item_id,
                    brand: meta.brand_name,
                    name: meta.title,
                    quantity: param.quantity,
                    price: meta.price,
                    variant: json.option,
                }]); // avoid NaN
            }
            var args: any = {
                'THING_ID': param.thing_id,
                'ITEMCODE': json.itemcode,
                'THUMBNAIL_IMAGE_URL': json.image_url,
                'ITEMNAME': json.itemname,
                'QUANTITY':json.quantity,
                'PRICE': json.price,
                'OPTIONS': json.option,
                'HTML_URL': json.html_url,
                'CART_ID': json.cart_id,
            };
            if (json.fancy_price) {
                args.FANCY_PRICE = json.fancy_price;
            }
            Fancy.Cart.addItem(args);
            Fancy.Cart.openPopup();
        } else if (json.status_code == 0) {
            if(json.message) {
                alert(json.message);
            }
        }
    })
    .always(function() { callback && callback(); });
}
