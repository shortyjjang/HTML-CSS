import React, { Component } from "react";
import { connect } from "react-redux";
import { isStaticPage } from "fancyutils";

import Thing from "./Thing";
import MerchantInfo from "./MerchantInfo";
import Recommendation from "./Recommendation";
import Reviews from "./Reviews";

import { historyData } from "../../container/history";
import FancyContext, { getFancyContextDefaultValue, useFancy } from "./FancyContext";

import { OverlayPropsV1 } from "ftypes";
import store from '../../store/store';
import { updateSaleContext } from '../../action/action-helpers';
import { mapStateToThingProps } from "../map";

function AdminMessages() {
    const {
        thing,
    } = useFancy();

    if (!thing.messages) {
        return null;
    }

    return (
        <div className="warning">
            <span>This item is not visible to customers because:</span>
            <ul>
                {thing.messages.map((m, i) => (
                    <li key={i}>{m}</li>
                ))}
            </ul>
        </div>
    );
}

function BreadCrumb() {
    const { thing } = useFancy();

    return (
        <div className="breadcrumb">
            {thing.breadcrumbs.map(({ label, href }, i) => (
                <React.Fragment key={i}>
                    <a href={href}>{label}</a>{" "}
                    {i !== thing.breadcrumbs.length - 1 ? (
                        <>
                            <span className="arrow">&gt;</span>{" "}
                        </>
                    ) : null}
                </React.Fragment>
            ))}
        </div>
    );
}

class AppV2 extends Component<OverlayPropsV1> {
    componentDidUpdate(prevProps: OverlayPropsV1) {
        const pt = prevProps.thing;
        const ct = this.props.thing;

        if (ct != null) {
            if (!pt || pt.id !== ct.id) {
                if (isStaticPage()) {
                    $(window).scrollTop(0);
                } else {
                    $("#overlay-thing > .popup").attr("tabindex", -1).focus();
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
                        store.dispatch(updateSaleContext({ saleOptionID: minimumOption.id }));
                    }
                }
            }
        }
    }

    getFancyContext() {
        return this.props.thing ? this.props : getFancyContextDefaultValue();
    }

    render() {
        const { thing } = this.props;

        if (historyData.locationIsThingPage && thing != null) {
            return (
                <FancyContext.Provider value={this.getFancyContext()}>
                    <AdminMessages />
                    <BreadCrumb />
                    <Thing />
                    <Reviews />
                    <MerchantInfo />
                    <Recommendation />
                </FancyContext.Provider>
            );
        } else {
            return <div />;
        }
    }
}

const ReduxComponentEnhancer = connect<OverlayPropsV1>(mapStateToThingProps);
const Overlay = ReduxComponentEnhancer(AppV2);

export default Overlay;
