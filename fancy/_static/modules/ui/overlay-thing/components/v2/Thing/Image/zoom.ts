import { minmax } from "fancyutils";
import { Display } from "fancymixin";
import { ThingImageOrVideo } from "ftypes";

// TODO: cache per (thing id + image index)
const zoomBoxMaximumSize = 240;
const zoomScale = 1.5;

const getBoundarySize = () => {
    const $el = $(
        ".thing-detail-container .figure-section .swiper-container.gallery-top .active-slide"
    ).eq(0);

    if ($el.length !== 1) {
        window.DEBUG && console.warn('getBoundarySize(): warning: $el.length is ', $el.length);
    }

    return {
        $el,
        width: $el.width()!,
        height: $el.height()!,
    };
};
type BS = ReturnType<typeof getBoundarySize>;

const getZoomBoxSize = (bs: BS) => Math.min(bs.width / 3, zoomBoxMaximumSize);
const getZoomMargin = (bs: BS) => (getZoomBoxSize(bs) - 4) / 2;

const zidCac: { [o: string]: any } = {};
const getZoomImageDimension = (img: ThingImageOrVideo, bs = getBoundarySize()) => {
    if (zidCac[img.image_url]) {
        return zidCac[img.image_url];
    }
    const zoomMargin = getZoomMargin(bs);
    // const imageSize = calculateImageSize(img);

    const ret = {
        width: bs.width * zoomScale /* * (imageSize.larger === "height" ? imageSize.proportion : 1) */ + zoomMargin,
        height: bs.height * zoomScale + zoomMargin,
        /* ((b.height * imageSize.height) / imageSize.width) *
                (imageSize.larger === "width" ? imageSize.proportion : 1) *
                zoomScale +
            zoomMargin ,*/
    };
    zidCac[img.image_url] = ret;
    return ret;
};

const getImageMeta = (bs: BS) => {
    let width, height, marginHoriz, marginVert;

    const $fig = $(".thing-detail-container .figure-section .swiper-container.gallery-top img:eq(0)");
    width = $fig.width()!;
    height = $fig.height()!;
    marginHoriz = 0;
    if (width > height) {
        marginHoriz = 0;
        marginVert = (bs.height - height) / 2;
    } else {
        marginHoriz = (bs.width - width) / 2;
        marginVert = 0;
    }
    return { width, height, marginHoriz, marginVert };
};

export const getNextZoomImageStyle = (img: ThingImageOrVideo, pageX: number, pageY: number) => {
    const bs = getBoundarySize();
    const $wrapper = bs.$el;

    if (!$wrapper.length) {
        return Display.None;
    }

    const boundaryWidth = bs.width;
    const boundaryHeight = bs.height;
    const meta = getImageMeta(bs);

    const offset = $wrapper.offset()!;
    const left = pageX - offset.left;
    const top = pageY - offset.top;

    const topPosition = top - (boundaryHeight - meta.height) / 2;

    const showZoomImage = left > 0 && topPosition > 0 && topPosition < meta.height;

    const zoomBoxSize = getZoomBoxSize(bs);
    const zoomMargin = getZoomMargin(bs);

    if (showZoomImage) {
        const zd = getZoomImageDimension(img, bs);
        const zoomImageContainerX = minmax(
            left - zoomMargin,
            meta.marginHoriz,
            meta.marginHoriz + meta.width - zoomBoxSize
        );
        const zoomImageContainerY = minmax(
            top - zoomMargin,
            meta.marginVert,
            meta.marginVert + meta.height - zoomBoxSize
        );

        const backgroundLeft = (zd.width * left) / boundaryWidth - zoomMargin;
        const backgroundTop = (zd.height * top) / boundaryHeight - zoomMargin;

        const bgPosX = -minmax(backgroundLeft, 0, zd.width - zoomBoxSize);
        const bgPosY = -minmax(backgroundTop, 0, zd.height - zoomBoxSize);

        return {
            left: 0,
            top: 0,
            width: `${zoomBoxSize}px`,
            height: `${zoomBoxSize}px`,
            transform: `translate(${zoomImageContainerX}px, ${zoomImageContainerY}px)`,
            backgroundPosition: `${bgPosX}px ${bgPosY}px`,
            display: "inline",
        };
    } else {
        return Display.None;
    }
};

const RESIZED_SIZE = 1280;
const calculateImageSize = (img: ThingImageOrVideo) => {
    const size = Math.max(img.width, img.height);
    if (size < RESIZED_SIZE) {
        const smallerSize = Math.min(img.width, img.height);
        return {
            width: img.width,
            height: img.height,
            proportion: size / smallerSize,
            larger: img.width > img.height ? "width" : "height",
        };
    } else {
        if (img.width > img.height) {
            const proportion = RESIZED_SIZE / img.width;
            return {
                width: RESIZED_SIZE,
                height: img.height / proportion,
                proportion,
                larger: "width",
            };
        } else {
            const proportion = RESIZED_SIZE / img.height;
            return {
                width: img.width / proportion,
                height: RESIZED_SIZE,
                proportion,
                larger: "height",
            };
        }
    }
};

export const isZoomable = (img: ThingImageOrVideo) => {
    const imageSize = calculateImageSize(img);
    const boundarySize = getBoundarySize();

    return imageSize.width > boundarySize.width * zoomScale || imageSize.height > boundarySize.height * zoomScale;
};

export const getZoomImageStyle = (img: ThingImageOrVideo, isZoomActive: boolean, currentZoomImageStyle: any) => {
    if (isZoomActive) {
        const zd = getZoomImageDimension(img);
        const ret = {
            ...currentZoomImageStyle,
            backgroundSize: `${zd.width}px ${zd.height}px`,
        };
        return ret;
    } else {
        return Display.None;
    }
};
