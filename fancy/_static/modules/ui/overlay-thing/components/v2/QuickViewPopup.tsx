import React, { useEffect } from "react";
import { OverlayProps, ReduxProps, SaleOption } from "ftypes";
import cx from "classnames";
import { floatFormatMinusTwo, numberFormat, renderPopup } from "fancyutils";
import { closePopup } from "fancyutils";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

import FancyContext, { getFancyContextDefaultValue, useFancy } from "./FancyContext";
import SaleItemSidebarHead from "./Thing/SaleItem";
import Image from "./Thing/Image";
import store from "../../store/store";
import { fetchThing, updateSaleContext } from "../../action/action-helpers";
import { getCurrentSaleOption, mapStateToThingProps } from "../map";
import { connect, Provider, useDispatch } from "react-redux";
import type { OverlayPropsV1 } from "ftypes";

export default class QuickViewPopup extends React.Component<{ thingID: string }> {
    static popupName = "thing-quickview";

    handleCancelClick = (event) => {
        event.preventDefault();
        closePopup(QuickViewPopup.popupName);
    };

    componentDidMount() {
        $.dialog(QuickViewPopup.popupName).center();
    }

    render() {
        return <QuickView thingID={this.props.thingID} />;
    }
}

const QuickView: React.FC<{ thingID: string }> = ({ thingID }) => {
    return (
        <Provider store={store}>
            <QuickViewEnhanced thingID={thingID} />
        </Provider>
    );
};

const QuickViewInside: React.FC<{ thingID: string } & OverlayProps & ReduxProps> = ({ thingID, ...props }) => {
    const dispatch = useDispatch();
    const { thing: ct } = props;

    useEffect(() => {
        if (!ct) {
            return;
        }
        if (ct.sales && ct.sales.options && ct.sales.options.length > 1) {
            const nonSoldoutOptions = ct.sales.options.filter((o) => !o.soldout);
            let minimumOption;
            if (nonSoldoutOptions.length > 0) {
                minimumOption = _.min(nonSoldoutOptions, (o) => Number(o.price));
            } else {
                minimumOption = _.min(ct.sales.options, (o) => Number(o.price));
            }
            if (ct.sales.options[0].id !== minimumOption.id) {
                dispatch(updateSaleContext({ saleOptionID: minimumOption.id }));
            }
        }
    }, [ct]);

    useEffect(() => {
        dispatch(fetchThing(thingID, "things", false, false, ""));
    }, [thingID]);

    if (!props.thing?.sales) {
        return null;
    }

    return (
        <FancyContext.Provider value={props.thing ? props : getFancyContextDefaultValue()}>
            <QuickviewContent />
            <Image imageOnly thumbsPerView={4} galleryThumbsDirection="horizontal" />
            <SaleItemSidebarHead showInfo={false} {...props} />
        </FancyContext.Provider>
    );
};

const QuickviewContent = () => {
    const fancyProps = useFancy();
    const {
        thing,
        thing: { sales },
    } = fancyProps;
    return (
        <>
            <div className="title">
                <a href="#" className="brand">
                    Richard Clarkson Design
                </a>
                {thing.emojified_name}
                <Price {...fancyProps} />
            </div>
            <dl className="description optional">
                <dt>Description</dt>
                <dd className="collapsed">
                    Brass rods are pushed into each of these holes forming a concave structure reminiscent of a bike
                    wheel. The holes are drilled to such a fine tolerance...
                </dd>
                <a className="more" href={thing.url}>
                    See Full Details
                </a>
            </dl>
            <a href={thing.url} className="btn-detail">
                See Full Details
            </a>
        </>
    );
};

const Price = ({ thing, saleContext }) => {
    const opt = getCurrentSaleOption(thing.sales, saleContext) as SaleOption;
    const discountPercentage = parseFloat(opt.discount_percentage); // TODO: use decimal?
    const discounting = discountPercentage > 0;
    const retailPrice = opt.retail_price;
    return (
        <div className="price">
            ${floatFormatMinusTwo(saleContext.price)}
            {discounting && (
                <>
                    <em className="before">${floatFormatMinusTwo(retailPrice)}</em>
                    <small className="saved">
                        (Save {numberFormat(discountPercentage, 0)}%)
                    </small>
                </>
            )}
        </div>
    );
};

if (__Config.bugsnag) {
    Bugsnag.start({
        apiKey: "a54d48e98cb0410b7bdf0e60a905b00e",
        plugins: [new BugsnagPluginReact()],
        user: {
            id: window.__FancyUser?.id || null,
        },
    });
}

const ReduxComponentEnhancer = connect<OverlayPropsV1>(mapStateToThingProps);
const QuickViewEnhanced = ReduxComponentEnhancer(QuickViewInside);

$(".quickview-open").on("click", function () {
    const tid = $(this).attr("data-tid");
    renderPopup(QuickViewPopup, { thingID: tid });
});
