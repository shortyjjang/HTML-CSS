// SaleItem#get_status
export const salesStatus = {
    EXPIRED: 'Expired',
    REMOVED: 'Deleted',
    PENDING: 'Pending',
    COMING_SOON: 'Coming soon',
    ACTIVE: 'Active',
    SOLD_OUT: 'Sold out'
};

export const FancyStatus = {
    Addition: 'Addition',
    Removal: 'Removal',
    AfterAddition: 'AfterAddition',
    AfterRemoval: 'AfterRemoval',
    Idle: 'Idle',
};

export const textareaHeight = {
    collapsed: 20,
    expanded: 40
};

const commonWrapperSelector = '#container-wrapper .wrapper-content #content';
export const Selectors = {
    HomepageWrapper: commonWrapperSelector,
};

const zoomMargin = 125;
export const ThingViewConfig = {
    boundarySize: 640,
    zoomMargin,                  // zoom box size 250 (246 + 2 + 2) / 2
    zoomBoxSize: zoomMargin * 2, // zoom box size 250 (246 + 2 + 2) / 2
    zoomScale: 1.5,
};

export const StaticThingViewConfig = {
    ThumbnailsLimit: {
        Basic: 18,
        More: 200,
    },
}
