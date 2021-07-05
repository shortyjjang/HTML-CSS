import { alertify, isEmpty } from "fancyutils";
import {
    SaleObject,
    SaleContext,
    ThingObject,
    FancyReduxState,
    User,
    ThingImage,
    OverlayPropsV1,
} from "ftypes";
import { SaleItem } from "_static/modules/ThingDetail";

const { gettext, _ } = window;

export function mapStateToThingProps(state: FancyReduxState): OverlayPropsV1 {
    const {
        appContext,
        thing: { data, isFetching, status },
        followContext,
        fancyContext,
        slideContext,
        saleContext,
    } = state;

    return {
        appContext,
        status,
        thing: data,
        isFetching,
        followContext,
        fancyContext,
        slideContext,
        saleContext,
    };
}

export function getSales(type: string, thing: ThingObject) {
    return thing.sales;
}

export function getDescription(type: string, thing: ThingObject) {
    if (type === "sales") {
        return thing.sales.description;
    } else if (type === "hotel") {
        return thing.hotel_search.details.propertyDescription;
    }
}

// Get sale item id via permission / sales availability
export function getSaleItemId(thing: ThingObject, viewer: User) {
    if (viewer && viewer.is_admin_any) {
        if (thing.sales) {
            return thing.sales.id;
        } else if (thing.inactive_sales) {
            return thing.inactive_sales.id;
        }
    }
}

// Get sale item id via permission / sales availability
export function getSeller(thing: ThingObject) {
    if (thing.sales) {
        return thing.sales.seller;
    } else if (thing.inactive_sales) {
        return thing.inactive_sales.seller;
    }
}

export function getDetailType(thing: ThingObject) {
    if (thing.hotel_search) {
        return "hotel";
    } else if (thing.sales_available && thing.type !== "vanity_number") {
        return "sales";
    } else if (!thing.sales_available && !thing.has_launch_app && thing.type !== "giftcard") {
        return "urlOnly";
    }
}

export function isSalesOptionsAvailable<T extends SaleItem>(sales: T | null) {
    return sales != null && !isEmpty(sales.options);
}

export function getFirstSaleOption(sales: SaleItem, ignoreEmptySaleOption = false) {
    if (isSalesOptionsAvailable(sales)) {
        return sales.options[0];
    } else if (ignoreEmptySaleOption === false) {
        return sales || null;
    }
}

export function getCurrentSaleOption<T extends SaleItem>(sales: T, saleContext: SaleContext = {}, ignoreEmptySaleOption = false) {
    const { saleOptionID } = saleContext;

    if (isSalesOptionsAvailable<T>(sales)) {
        if (saleOptionID) {
            const opts = _(sales.options).filter((prop) => prop.id === saleOptionID);
            if (opts[0] == null) {
                console.warn("saleOption should not be null!");
            }

            return opts[0] == null
                ? {
                      id: 0,
                      discount_percentage: "0.0",
                      quantity: 0,
                      soldout: true,
                      retail_price: 0,
                      name: '',
                  }
                : opts[0];
        } else {
            return sales.options[0];
        }
    } else if (ignoreEmptySaleOption === false) {
        return sales;
    }
}

export function formatPrice(amount: number, currency: string) {
    if (currency == "BTC") return amount + "";
    var newPrice = amount.toFixed(2) + "";
    var regex = /(\d)(\d{3})([,\.]|$)/;
    while (regex.test(newPrice)) {
        newPrice = newPrice.replace(regex, "$1,$2$3");
    }
    if (window.numberType === 2) {
        newPrice = newPrice.replace(/,/g, " ").replace(/\./g, ",");
    }
    return newPrice;
}

// sales: thing.sales
export function getDomesticDeliveryDate(sales: SaleObject) {
    var date = "";
    if (sales.expected_delivery_day_1) {
        date += sales.expected_delivery_day_1;
    }
    if (sales.expected_delivery_day_2) {
        date += " - " + sales.expected_delivery_day_2;
    }
    return date;
}

// sales: thing.sales
export function getIntlDeliveryDate(sales: SaleObject) {
    var date = "";
    // TODO: use moment for locale string
    if (sales.expected_delivery_day_intl_1) {
        date += sales.expected_delivery_day_intl_1;
    }
    if (sales.expected_delivery_day_intl_2) {
        date += " - " + sales.expected_delivery_day_intl_2;
    }
    return date;
}

export function currencyIsUSD({ saleContext }: { saleContext: SaleContext }) {
    return saleContext.currencyCode === "USD";
}

// [sale option id]: { true | false }
const saleOptionWaitingRegistry = {};
window.saleOptionWaitingRegistry = saleOptionWaitingRegistry;
export function setWaiting(chosenSaleOptionID, setResult) {
    saleOptionWaitingRegistry[chosenSaleOptionID] = setResult;
}
export function getWaiting<T extends SaleItem>(sales: T, saleContext) {
    if (sales == null) {
        return null;
    }
    if (saleContext.waiting != null) {
        return saleContext.waiting;
    }

    // https://app.asana.com/0/86925821949642/160205241997173
    // It could be a bit weird for future, but design-side decision
    if (sales.waiting) {
        return sales.waiting;
    }

    const chosenSaleOption = getCurrentSaleOption(sales, saleContext);
    // options is SaleItem
    if (sales.id === chosenSaleOption.id) {
        return sales.waiting;
        // option is SaleOption
    } else {
        if (saleOptionWaitingRegistry[chosenSaleOption.id] != null) {
            return saleOptionWaitingRegistry[chosenSaleOption.id];
        } else if (chosenSaleOption.waiting != null) {
            return chosenSaleOption.waiting;
        }
    }
}

function fillArray(original: Array<unknown> /*sparse?ArrayToFill*/, filler: Array<unknown>) {
    const ol = original.length;
    const fl = filler.length;
    const sparseIdxs = [];
    // Find sparse indexes first.
    for (let j = 0; j < ol; j++) {
        if (!(j in original)) {
            sparseIdxs.push(j);
        }
    }
    for (let i = 0; i < fl; i++) {
        // if sparse indexes are all in (or nonexist), push leftovers to tail
        if (i > sparseIdxs.length - 1) {
            original.push(filler[i]);
        } else {
            original[sparseIdxs[i]] = filler[i];
        }
    }
    return original;
}

let tid;
let optionId: undefined;
let hotelImages: ThingImage[] | undefined | [];
let salesImages;
let thingImages;
export function getSaleImages(thing: ThingObject, option, thumbnailsLimit?: number) {
    if (thing.hotel_search != null) {
        if (tid !== thing.id) {
            // Caching structure
            if (thing.fromServer) {
                tid = thing.id;
            }

            hotelImages = <ThingImage[]>thing.hotel_search.images.map((img) => ({
                src: img.url,
                thumbnail_src: img.thumbnailUrl,
                width: img.width,
                height: img.height,
            }));
            hotelImages.unshift(thing.image_resized_max);
        }
        return hotelImages;
    } else if (thing.sales != null) {
        const images = [];
        fillArray(images, thing.images);
        if (option && option.images && option.images.length > 0) {
            fillArray(images, option.images);
        }
        salesImages = images;
        if (option) {
            optionId = option.id;
        }
        if (thing && thing.sales && thing.sales.video) {
            images.unshift(thing.sales.video);
        }
        return salesImages;

        if (tid !== thing.id) {
            // Caching structure
            if (thing.fromServer) {
                tid = thing.id;
            }
            // optionId = option ? option.id : null;
            // FIXME: do this somewhere else
            if (thing.image_resized_max == null) {
                if (thing.image.src) {
                    thing.image_resized_max = {
                        src: thing.image.src,
                        width: thing.image.width,
                        height: thing.image.height,
                        thumbType: "thing",
                    }; // FIXME: to prevent null referencing
                } else {
                    thing.image_resized_max = {
                        src: "/_ui/images/common/blank.gif",
                        width: 1,
                        height: 1,
                        thumbType: "thing",
                    }; // FIXME: to prevent null referencing
                }
            }

            let images = [];

            if (thing.image_resized_max) {
                images.push(thing.image_resized_max);
            }

            if (thing.images && thing.images[0]) {
                images.push(thing.images[0]);
            }

            // set sale images
            if (thing && thing.sales && thing.sales.video) {
                let video = { src: thing.sales.video.thumbnail_url, thumbType: "video" };
                if (thing.sales.video.position > 0) {
                    images[thing.sales.video.position] = video;
                } else {
                    // set video to first unless the position is set
                    images.unshift(video);
                }
            }
            if (thing.sales.images) {
                fillArray(images, thing.sales.images);
            }
            salesImages = images;
        }
        if (option && optionId !== option.id) {
            optionId = option.id;
            if (salesImages == null) {
                salesImages = [];
            }
            if (option.images && option.images.length > 0) {
                const images = salesImages.filter((img) => img.option_id == null);
                fillArray(images, option.images);
                salesImages = images;
            }
        }

        return _.isNumber(thumbnailsLimit) && thumbnailsLimit > 0
            ? salesImages.filter((image, idx) => idx < thumbnailsLimit && image.src)
            : salesImages;
    } else {
        if (tid !== thing.id) {
            // Caching structure
            if (thing.fromServer) {
                tid = thing.id;
            }
            if (thing.image_resized_max) {
                thingImages = [thing.image_resized_max];
            } else if (thing.image) {
                thingImages = [thing.image];
            } else {
                thingImages = [];
                // || (option && optionId !== option.id)
            }
        }
        return thingImages;
    }
}

export function isVanityQueriable(props: any, suppress: boolean) {
    var { AC, minPrice, maxPrice, keyword } = props;

    keyword = $.trim(keyword);
    AC = $.trim(AC);
    minPrice = minPrice != null ? minPrice : "0";
    minPrice = $.trim(minPrice).replace(",", "").replace("$", "");
    maxPrice = $.trim(maxPrice).replace(",", "").replace("$", "");

    const original_labels = alertify.labels;
    if (AC !== "") {
        if (_.isNaN(parseInt(AC, 10)) || AC.length !== 3) {
            alertify.set({ labels: { ok: "Close" } });
            !suppress && alertify.alert("Invalid area code. Area code should be 3 digits.");
            alertify.set({ labels: original_labels });
            return false;
        }
    }

    if (minPrice !== "") {
        if (_.isNaN(parseInt(minPrice, 10))) {
            alertify.set({ labels: { ok: "Close" } });
            !suppress && alertify.alert("Please check min price. It should be number.");
            alertify.set({ labels: original_labels });
            return false;
        }

        if (parseInt(minPrice, 10) >= parseInt(maxPrice, 10)) {
            alertify.set({ labels: { ok: "Close" } });
            !suppress && alertify.alert("The max price number should be bigger than min price number.");
            alertify.set({ labels: original_labels });
            return false;
        }
    }

    if (maxPrice !== "") {
        if (_.isNaN(parseInt(maxPrice, 10))) {
            alertify.set({ labels: { ok: "Close" } });
            !suppress && alertify.alert("Please check max price. It should be number.");
            alertify.set({ labels: original_labels });
            return false;
        }
    }

    if (keyword !== "") {
        if (keyword.length < 4) {
            alertify.set({ labels: { ok: "Close" } });
            !suppress && alertify.alert("Please enter 4 or more characters.");
            alertify.set({ labels: original_labels });
            return false;
        }
    }

    return true;
}

export function getSafeNameProp({ emojified_name, name }: ThingObject) {
    if (emojified_name) {
        return { dangerouslySetInnerHTML: { __html: emojified_name } };
    } else {
        return { children: name };
    }
}

export function isVideoUploadable(thing: ThingObject): boolean {
    if ((thing && thing.hotel_search) || thing.metadata) {
        return true;
    } else {
        return false;
    }
}

function salesAvailable(thing: ThingObject): boolean {
    if (!isEmpty(thing.sales)) {
        return thing.sales_available;
    }
    return false;
}

export function getThingName(thing: ThingObject) {
    if (thing.type === "giftcard") {
        return gettext("Fancy Gift Card");
    } else if (salesAvailable(thing)) {
        return thing.sales.name;
    } else {
        return thing.name;
    }
}
