import React, { Component, lazy, Suspense } from "react";
import SaleItem from "./SaleItem";

export default class SidebarHead extends Component {
    getHead(META) {
        if (META.type === "SaleItem") {
            return SaleItem;
        } else {
            if (META.type === "PlainThing") {
                return lazy(() => import(/* webpackChunkName: "OverlayThing.extras" */ "./PlainThing"));
            } else if (META.type === "Giftcard") {
                return lazy(() => import(/* webpackChunkName: "OverlayThing.extras" */ "./Giftcard"));
            } else if (META.type === "Vanity") {
                return lazy(() => import(/* webpackChunkName: "OverlayThing.extras" */ "./Vanity"));
            } else if (META.type === "Hotel") {
                return lazy(() => import(/* webpackChunkName: "OverlayThing.extras" */ "./Hotel"));
            } else if (META.type === "LaunchApp") {
                return lazy(() => import(/* webpackChunkName: "OverlayThing.extras" */ "./LaunchApp"));
            }
        }
    }

    render() {
        var {
            thing: { META },
            appContext: { viewer },
        } = this.props;

        if (!viewer.is_admin_any && META.type === 'PlainThing') {
            location.href = '/';
            return null;
        }

        const Head = this.getHead(META);
        if (META.type === "SaleItem") {
            return <Head {...this.props} fallback={<div className="wrapper figure-info" />} />;
        } else {
            return (
                <Suspense fallback={<div />}>
                    <Head {...this.props} fallback={<div className="wrapper figure-info" />} />
                </Suspense>
            );
        }
    }
}
