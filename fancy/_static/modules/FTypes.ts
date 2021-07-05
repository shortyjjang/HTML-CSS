import type { Action, Dispatch } from "redux";
import type { ThunkAction } from "redux-thunk";

import { ThingDetailObject } from "./ThingDetail";
import { SaleContext, AppContext, SlideContext, FancyContext, FollowContext } from "./Context";
import type { AppDispatch } from "./ui/overlay-thing/store/store";

export interface Bundle extends Object {
    shouldInitOverlayArticle?: boolean;
    initOverlayThing?: Function;
    initOverlayArticle?: Function;
    loaded?: boolean;
    cssToLoad?: Object;
}

// MoreShareRenderer.ts
export interface PseudoTriggeredEvent {
    currentTarget: Element;
}

export interface MoreshareRenderData {
    loggedIn: boolean;
    title?: string;
    viewerUsername?: string;
    objectId?: string;
    objectType?: string;
    showShortcuts: boolean;
    objectMeta?: Object;
    onShowSomething?: Function;
}

// Thing v1 serialization Objects (different to REST v1)
export interface ThingV1Response {
    id_str: string;
    name: string;
    has_launch_app: boolean;
    thumb_image_url_310: string;
    image_url: string;
    image_url_width: number;
    image_url_height: number;
    can_be_modified: boolean;
    fancyd_users: FancydUsersResponse[];
    // sales: SalesResponse[];
    sales?: any;
    ["fancy'd"]: boolean;
    user: ThingUserResponse;
    fancys: number;
    url: string;
    hotel_search: {
        images: {
            url: string;
            thumbnailUrl: string;
            width: number;
            height: number;
        }[];
        details: {
            propertyDescription: string;
        };
    };
    metadata: any;
    emojified_name: string;
    show_on_homepage: boolean;
    html_url: string;
    image_resized_max: ThingImage;
    inactive_sales: InactiveSaleItem;
}

export interface ThingImage {
    src: string;
    width: number;
    height: number;
    thumbType?: "video" | "thing";
}

interface ThingUserResponse {
    username: string;
}
interface SaleImage {
    src: any;
    width: any;
    height: any;
}
export interface SalesResponse {
    sales_available: boolean;
    id: number;
    sale_id: number;
    description: string;
    name: string;
    fancyd: boolean;
    thumb_image_url_310: any;
    fancyd_count: number;
    images: SaleImage[];
    owner: FancydUsersResponse;
    html_url: string;
    fancyd_users: FancydUsersResponse[];
    fancy_price: number;
    remaining_quantity: number;
    available_for_sale: boolean;
    price?: number;
    quantity?: number;
    expected_delivery_day_1: number;
    expected_delivery_day_2: number;
    video: SaleVideo;
    reviews: ReviewResponse[];
    options: SaleOptionV1[];
    option_meta: SaleOptionMeta[];
    show_anywhere_only: boolean;
    expected_delivery_day_intl_1: number;
    expected_delivery_day_intl_2: number;
    return_exchange_policy_title: string;
    shipping_location: string;
    international_shipping: boolean;
    size_guide_id: number;
    seller: User & {
        brand_name: string;
        country: "US";
    };
    shipping_info: {
        cost: string | null;
        origin: string | null;
        window: string | null;
    };
}

interface SaleOptionMeta {
    type: string;
    values: string[];
    name: string;
}

export interface InactiveSaleItem {
    id: number;
    seller: FancydUsersResponse;
}

interface SaleOptionV1 {
    id: number;
    name: string;
    price: number;
    values: string[];
    images: SaleOptionImage[];
    waiting: boolean;
    soldout: boolean;
}

interface SaleVideo {
    position: number;
    thumbnail_url: string;
}
export interface SaleOptionImage {}
interface ReviewResponse {}

export interface SaleObject extends SalesResponse {}

interface FancydUsersResponse {}

export interface ArticleResponse {}

// https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
export interface ThingObject extends ThingV1Response {
    sales_available: boolean;
    id: string;
    name: string;
    fancyd: boolean;
    thumb_image_url_310: string;
    fancyd_count: number;
    image: { src: string; width: number; height: number };
    owner: ThingUserResponse;
    fancyd_users: FancydUsersResponse[];
    isCrawled?: boolean;
    type?: string;
    sales: SaleObject | null;
    fromServer?: boolean;
}

export interface User {
    id: number;
    username: string;
    is_admin_any: boolean;
    is_admin_senior: boolean;
    is_admin_cs: boolean;
    is_admin_content: boolean;
    is_admin_brand: boolean;
    is_admin_business: boolean;
    is_admin_design: boolean;
    is_admin_wholesale: boolean;
}

// no point adding type, just put any
export interface GlobalFancySomething {
    Cart: {
        add(objectArg: any): void;
        openPopup(): void;
        addItem(objectArg: any): void;
    };
}

export interface FancyUserConfig {
    loggedIn: boolean;
    merchant: boolean;
    id: string | null;
    viewerUsername: string;
    active_merchant?: boolean;
    anonymous?: boolean;
}

export interface FancyReduxState {
    appContext: AppContext;
    thing: {
        data: ThingObject;
        isFetching: boolean;
        status: string;
    };
    followContext: FollowContext;
    fancyContext: FancyContext;
    slideContext: SlideContext;
    saleContext: SaleContext;
}

interface OverlayState<T> {
    appContext: AppContext;
    thing: T;
    followContext: FollowContext;
    fancyContext: FancyContext;
    slideContext: SlideContext;
    saleContext: SaleContext;
}

interface NetworkState {
    status: string;
    isFetching: boolean;
}

export interface ReduxProps {
    dispatch: AppDispatch;
}

export interface VariableDict {
    [k: string]: any;
}

export interface OverlayPropsV1 extends OverlayState<ThingObject>, NetworkState, ReduxProps {}
export interface OverlayProps extends OverlayState<ThingDetailObject>, NetworkState {}

export * from "./ThingDetail";
export * from "./Context";
