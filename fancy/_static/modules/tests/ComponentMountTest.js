import { assert } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import { selectOrCreate } from 'fancyutils';

import Thing from '../../_ui/js/overlay-thing/components/Thing';
import { Overlay } from '../../_ui/js/overlay-thing/components/Overlay';

import {
    FancydByPopup, FancydByFriendsPopup,
    ShippingCountriesPopup,
    CurrencyPopup,
    BookingResultPopup,
    RequestSalePopup,
    SizeGuidePopup,
    ReturnPolicyDetailPopup,
    EditPopup,
    ReviewsPopup,
    VanityLearnMore, VanitySearchResult
} from '../../_ui/js/overlay-thing/components/popup/index.js';
import { PlainThingType, SaleItemType } from '../../_ui/js/overlay-thing/ThingTypes.js';

import { MoreShare } from 'common-components';


function createContextProps(...args) {
    const [thing, appContext, slideContext] = args;
    return { thing, appContext, slideContext }
}

describe('ComponentMountTest', function(){
    // Fixtures
    const thingWithoutSales = PlainThingType.createEmptyObject();
    const saleItem = SaleItemType.createEmptyObject();

    const appContext = { viewer: {} };
    const slideContext = { thumbnailIndex: 0 };

    const plainThingCtx = createContextProps(thingWithoutSales, appContext, slideContext);
    const saleItemCtx = createContextProps(saleItem, appContext, slideContext);

    let overlayContainer;
    beforeEach(() => {
        overlayContainer = selectOrCreate('#overlay-thing');
    });

    afterEach(() => {
        overlayContainer.remove();
    });

    // Detail overlay
    it('<Overlay /> with plain thing', function () {
        const ci = ReactDOM.render(<Overlay {...plainThingCtx} />, overlayContainer);
    });

    it('<Thing /> with plain thing', function () {
        const ci = ReactDOM.render(<Thing {...plainThingCtx} />, overlayContainer);
    });

    it('<Overlay /> with saleitem', function () {
        const ci = ReactDOM.render(<Overlay {...saleItemCtx} />, overlayContainer);
    });

    it('<Thing /> with saleitem', function () {
        const ci = ReactDOM.render(<Thing {...saleItemCtx} />, overlayContainer);
    });
    // Popup
    it('<FancydByPopup />', function () {
        // TODO: thing_id only needed
        const ci = ReactDOM.render(<FancydByPopup {...plainThingCtx} followContext={{ followUser: {} }} />, overlayContainer);
    });

    it('<FancydByFriendsPopup />', function () {
        const ci = ReactDOM.render(<FancydByFriendsPopup {...plainThingCtx} />, overlayContainer);
    });

    it('<CurrencyPopup />', function () {
        const ci = ReactDOM.render(<CurrencyPopup {...plainThingCtx} />, overlayContainer);
    });

    it('<ShippingCountriesPopup />', function () {
        const ci = ReactDOM.render(<ShippingCountriesPopup {...plainThingCtx} />, overlayContainer);
    });

    it('<CurrencyPopup />', function () {
        const ci = ReactDOM.render(<CurrencyPopup {...plainThingCtx} />, overlayContainer);
    });

    it('<BookingResultPopup />', function () {
        const ci = ReactDOM.render(<BookingResultPopup {...plainThingCtx} />, overlayContainer);
    });

    it('<RequestSalePopup />', function () {
        const ci = ReactDOM.render(<RequestSalePopup {...plainThingCtx} />, overlayContainer);
    });

    it('<SizeGuidePopup />', function () {
        const ci = ReactDOM.render(<SizeGuidePopup {...saleItemCtx} />, overlayContainer);
    });

    it('<ReturnPolicyDetailPopup />', function () {
        const ci = ReactDOM.render(<ReturnPolicyDetailPopup {...saleItemCtx} sales={saleItemCtx.thing.sales} />, overlayContainer);
    });

    it('<EditPopup />', function () {
        const ci = ReactDOM.render(<EditPopup {...plainThingCtx} />, overlayContainer);
    });

    it('<ReviewsPopup />', function () {
        const ci = ReactDOM.render(<ReviewsPopup {...saleItemCtx} sales={saleItemCtx.thing.sales} />, overlayContainer);
    });

    it('<VanityLearnMore />', function () {
        const ci = ReactDOM.render(<VanityLearnMore {...plainThingCtx} />, overlayContainer);
    });

    it('<VanitySearchResult />', function () {
        const ci = ReactDOM.render(<VanitySearchResult {...plainThingCtx} />, overlayContainer);
    });

    // Common components
    it('<MoreShare />', function () {
        const ci = ReactDOM.render(<MoreShare {...{
            loggedIn: true,
            showShare: true,
            title: 'thing name is thing name.',
            objectType: 'thing',
            objectId: 1,
        }} />, overlayContainer);
    });
});
