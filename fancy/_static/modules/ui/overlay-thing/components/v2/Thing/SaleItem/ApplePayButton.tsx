import React from "react";
import type { OverlayProps } from "ftypes";
import { isSalesOptionsAvailable } from "../../../map";
import { useFancy } from "../../FancyContext";

const ApplePayButton: React.FC<OverlayProps> = () => {
    const {
        appContext: { /*applePayDisplay, */ applePayTest },
        thing,
        thing: { sales },
        saleContext: { saleOptionID, selectedQuantity, price },
    } = useFancy();

    const handleApplePayCheckout : React.MouseEventHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!saleOptionID || window.FancyApplePay.clicked) {
            return;
        }
        window.FancyApplePay.clicked = true;

        const salesOptionsAvailable = isSalesOptionsAvailable(sales);

        var title = thing.name;
        var country = sales.seller.country;
        var sale_item_id = sales.id;
        var seller_id = sales.seller.id;
        var quantity = selectedQuantity;

        var option_id = null;
        var option = null;
        if (salesOptionsAvailable) {
            option_id = parseInt(saleOptionID, 10) || null; // ? should be same value with option except get casted
            option = saleOptionID;
        }

        try {
            window.FancyApplePay.requestPurchase("Dynamic", {
                sale_item_id,
                seller_id,
                option_id,
                quantity,
                price,
                title,
                option,
                country,
                testmode: applePayTest,
            });
        } catch (err) {
            window.DEBUG && console.trace(err);
            alert(err);
            window.FancyApplePay.clicked = false;
        }
    };
    return (
        <div
            className="applePayButton"
            style={{
                WebkitAppearance: "-apple-pay-button",
                ApplePayButtonType: "plain",
                ApplePayButtonStyle: "black",
            }}
            onClick={handleApplePayCheckout}></div>
    );
}

export default ApplePayButton;