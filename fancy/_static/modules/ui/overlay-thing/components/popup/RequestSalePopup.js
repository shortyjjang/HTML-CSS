import React from 'react';
import { closePopup } from 'fancyutils';

import appState from '../../appstate';
import { redirect } from '../../container/routeutils';


export default class RequestSalePopup extends React.Component {
    static popupName = 'request_sale';
    handleCustomerRequestSale = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (appState.loggedIn !== true) {
            window.require_login();
            return;
        }

        $.ajax({
            type : 'post',
            url  : '/send_email_for_sale_request.json',
            data : { new_thing_id: this.props.thing.ntid },
            dataType : 'json',
            success  : function(){
                alertify.alert(gettext("Thank you. Your request was successfully sent to Fancy."));
                closePopup('request_sale');
            },
            error : function(){
                alertify.alert(gettext("There was an error while sending request. Please try again later."));
            }
        });
    }

    handleMerchantRequestSale = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (appState.loggedIn !== true) {
            window.require_login();
            return;
        }
        const thing = this.props.thing;
        const baseURL = (appState.viewer.is_seller) ? '/merchant/products/new' : '/seller-signup';
        redirect(`${baseURL}?ntid=${thing.ntid}&ntoid=${thing.user.id}`);
    }

    render() {
        return (
            <div>
                <p className="ltit">{gettext("Request for sale")}</p>
                <ul className="after">
                    <li>
                        <a className="sell merchant"
                           onClick={this.handleMerchantRequestSale}>
                            <span className="tooltip">
                                <i className="icon" /> {gettext("For merchants")} <small>{gettext("I would like to sell this!")}<b /></small>
                            </span>
                        </a>
                    </li>
                    <li>
                        <a className="customer"
                           onClick={this.handleCustomerRequestSale}>
                            <span className="tooltip">
                                <i className="icon" /> {gettext("For customers")} <small>{gettext("I would like to buy this!")}<b /></small>
                            </span>
                        </a>
                    </li>
                </ul>
                <button className="ly-close" title="Close">
                    <i className="ic-del-black" />
                </button>
            </div>
        );
    }
}
