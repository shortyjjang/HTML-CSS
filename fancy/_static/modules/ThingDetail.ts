interface User {
    id: number;
    username: string;
    is_admin_any: boolean;
}

export interface SaleOption {
    discount_percentage: string;
    waiting: boolean;
    values: string[];
    name: string;
    quantity: number;
    images: [];
    price: string;
    retail_price: string;
    id: number;
    soldout: boolean;
}

interface SaleVideo {
    is_ready: boolean;
    featured: boolean;
    position: number;
    thumbnail_url: string;
    original_url: string;
    h264_1000k_url: string;
    loop: boolean;
    autoplay: boolean;
}

export interface SelectedMetaOption {
    swatch: string[];
    button: string[];
    thumbnail: string[];
    dropdown: string[];
}

export interface SaleOptionMeta {
    type: keyof SelectedMetaOption;
    values: string[];
    name: string;
}

export interface SaleItem {
    id: string;
    brand: null;
    status: "active";
    quantity: number;
    return_exchange_policy_title: string;
    soldout: boolean;
    waiting: boolean;
    specifications: string;
    discount_percentage: string;
    available: boolean;
    features: string;
    seller: SaleItemSeller;
    options: SaleOption[];
    option_meta: SaleOptionMeta[];
    shipping_info: {
        origin: string | null;
        window: string | null;
        cost: string | null;
    };
    international_shipping: boolean;
    shipping_policy: string;
    size_guide_id?: number;
    size_chart_ids?: number[];
    personalizable: boolean;
    video?: SaleVideo;
    price: string;
    retail_price: string;
    currency_type: "USD";
    description: string;
    approved: boolean;
}

export interface SaleItemCard {
    title: string;
    min_price_retail: string;
    thing_id: string;
    html_url: string;
    min_price: string;
    image_url: string;
    max_price: string;
}

export interface SaleItemSeller {
    id: number;
    username: string;
    description: string;
    shop_url: string;
    brand_name: string;
    sale_items: SaleItemCard[];
    brand_values: [string, string][];
}

export interface ReviewEntry {
    id: number;
    title: string;
    rating: number;
    date: string;
    images: {
        thumbnail_url: string;
        image_url: string;
    }[];
    sale_item: null;
    name: string;
    review: string;
}

export interface Reviews {
    reviews: ReviewEntry[];
    review_count: number;
    total_pages: number;
    page: number;
    summary: {
        total_ratings: number;
        attributes: {
            rating: string;
            label: string;
        }[];
        rating_avg: string;
        total_reviews: number;
    };
}

interface ThingImage {
    large_image_url: string;
    thumbnail_url: string;
    image_url: string;
    width: number;
    height: number;
}
interface ThingVideo {
    h264_1000k_url: string;
}
export interface ThingImageOrVideo extends ThingImage, ThingVideo {}

interface ThingDetailResponse {
    id: string;
    name: string;
    ntid: number;
    date_published: Date | null;
    exclude_from_popular: boolean;
    images: ThingImageOrVideo[];
    fancyd: boolean;
    show_in_search: boolean;
    show_on_homepage: boolean;
    thing_owner: {
        username: string;
        id: string;
    };
    breadcrumbs: {
        href: string;
        label: string;
    }[];
    viewer: User;
    sales: SaleItem;
    fancyd_count: number;
    url: string;
    emojified_name: string;
    reviews: Reviews;
    messages?: string[];
    recommended: SaleItemCard[];
    fancyd_person: string;
    fancyd_person_url: string;
}

export interface ThingDetailObject extends ThingDetailResponse {
    isCrawled?: boolean;
    type?: string;
    fromServer?: boolean;
    loading: boolean;
}
