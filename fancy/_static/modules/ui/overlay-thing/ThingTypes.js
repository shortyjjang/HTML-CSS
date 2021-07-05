// -- Members --
// className: string
// - class name that used from sidebar head 'wrapper figure-info {className}'.
// type: string
// - meta string that indicates type name
import { mergeObjectArgs } from 'fancyutils';

export class ThingTypeMeta {
    static isSale = false;
    static type = 'ThingTypeMeta';

    getName(thingContext) {
        return thingContext.name;
    }
}

export class PlainThingType extends ThingTypeMeta {
    static className = '';
    static type = 'PlainThing';
    static createEmptyObject(...args) {
        const objectArgs = mergeObjectArgs(args);
        const thing = $.extend(true, {
            id: '1',
            url: '/',
            isCrawled: false,
            owner: {},
            image: { src: '', width: 1, height: 1 },
            user: {},
            type: 'thing',
            fancyd_friends: [],
        }, objectArgs);
        thing.META = getThingType(thing);
        return thing;
    }
}

export class SaleItemType extends ThingTypeMeta {
    static className = '';
    static type = 'SaleItem';
    static getName(thingContext) {
        return thingContext.sales.name;
    }
    static createEmptyObject(objectArgs) {
        return PlainThingType.createEmptyObject({
            sales_available: true,
            sales: {
                id: '1',
                review_rating: 1,
                review_count: 1,
                size_chart_ids: ['1'],
                images: [{ src: '', width: 1, height: 1 }],
                seller: { id: '1' }
            },
            type: 'sales'
        }, objectArgs);
    }
}

export class GiftcardType extends SaleItemType {
    static className = 'giftcard';
    static type = 'Giftcard';

    static getName() {
        return window.gettext("Fancy Gift Card");
    }
}

export class HotelType extends SaleItemType {
    static className = 'hotel';
    static type = 'Hotel';

    static getName(thingContext) {
        return thingContext.hotel_search.hotel.name;
    }
}

export class VanityType extends SaleItemType {
    static className = 'vanity';
    static type = 'Vanity';
}

export class LaunchAppType extends ThingTypeMeta {
    static className = '';
    static type = 'LaunchApp';
}

// Retrieve meta by looking up thing object.
export function getThingType(thingContext) {
    var ThingType;
    if (thingContext.hotel_search) {
        ThingType = HotelType;
    } else if (thingContext.has_launch_app && thingContext.metadata) {
        ThingType = LaunchAppType;
    } else if (thingContext.type === 'giftcard') {
        ThingType = GiftcardType;
    } else if (thingContext.sales_available) {
        if (thingContext.type === 'vanity_number') {
            ThingType = VanityType;
        } else {
            ThingType = SaleItemType;
        }
    } else {
        ThingType = PlainThingType;
    }
    return ThingType;
}

const ThingTypes = [PlainThingType, SaleItemType, GiftcardType, HotelType, VanityType, LaunchAppType];

// TODO: immutable
ThingTypes.forEach(AttachingType => {
    ThingTypes.forEach(ComparingType => { 
        AttachingType[ComparingType.type] = AttachingType === ComparingType;
    });
});
