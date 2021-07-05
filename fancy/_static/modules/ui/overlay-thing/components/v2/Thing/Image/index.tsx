import React, { memo, useEffect, useState, useRef } from "react";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Thumbs, Zoom } from "swiper";
import { Video } from "common-components";
import { Display } from "fancymixin";

import { useFancy } from "../../FancyContext";
import ActionButtons from "../ActionButtons";
import { getCurrentSaleOption, getSaleImages } from "../../../map";
import { setThumbnailIndex } from "../../../../action/actions";
import { getZoomImageStyle, getNextZoomImageStyle } from "./zoom";

import type { ThingImageOrVideo } from "ftypes";
import type { Swiper as SwiperClass } from "swiper";

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
const SwiperAddons = [Thumbs];
if (isTouchDevice) {
    SwiperAddons.push(Zoom);
}
SwiperCore.use(SwiperAddons);

const placeholderImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const PER_PAGE = 5;

const preloadImage = (src: string) =>
    new Promise((r) => {
        const image = new window.Image();
        image.onload = r;
        image.onerror = r;
        image.src = src;
    });

interface ImageSlideProps {
    image: ThingImageOrVideo;
    i: number;
    isActive: boolean;
    setSlideLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageSlide = memo<ImageSlideProps>(
    ({ image, i, setSlideLocked, isActive }) => {
        const {
            thing,
            slideContext: { thumbnailIndex },
        } = useFancy();
        const [isZoomActive, setZoomActive] = useState(false);
        const [zoomImageStyle, setZoomImageStyle] = useState(Display.None);
        const [zoomImageCacheKey, setZoomImageCacheKey] = useState("");
        const [zoomImageLoaded, setZoomImageLoaded] = useState(false);

        const isVideo = !!image.h264_1000k_url;
        const isMagnifyingGlassZoomable = !isVideo && !isTouchDevice;

        useEffect(() => {
            if (!zoomImageCacheKey && isZoomActive) {
                preloadImage(image.large_image_url).then(() => {
                    setZoomImageCacheKey(image.large_image_url);
                    setZoomImageLoaded(true);
                });
            }
            if (zoomImageCacheKey !== "" && image.large_image_url !== zoomImageCacheKey) {
                setZoomImageCacheKey("");
                setZoomImageLoaded(false);
            }
        }, [image.large_image_url, isZoomActive, zoomImageCacheKey]);

        const handleMouseEvent = ({ pageX, pageY }) => {
            if (!isMagnifyingGlassZoomable) {
                return;
            }
            if (isZoomActive) {
                const nextZoomImageStyle = getNextZoomImageStyle(image, pageX, pageY);
                setZoomImageStyle(nextZoomImageStyle);
            }
        };

        return (
            <SwiperSlide
                zoom={isMagnifyingGlassZoomable}
                key={i}
                className={classnames({
                    "video-slide": isVideo,
                    startZoom: isZoomActive,
                    zoomShow: true,
                    "active-slide": isActive,
                    loading: thing.loading,
                })}
                onClick={({ pageX, pageY }) => {
                    if (!isMagnifyingGlassZoomable) {
                        return;
                    }
                    const nextZoomImageStyle = getNextZoomImageStyle(image, pageX, pageY);
                    setZoomImageStyle(nextZoomImageStyle);

                    setZoomActive(!isZoomActive);
                    setSlideLocked(!isZoomActive);
                }}
                onMouseMove={handleMouseEvent}>
                {isVideo ? (
                    <Video
                        object={image}
                        display={true}
                        playing={thumbnailIndex == i}
                        lastFullyRenderedObjectID={thing.id}
                        allow={{ fullScreen: true }}
                    />
                ) : (
                    <>
                        <img
                            className="swiper-lazy"
                            src={image.image_url}
                            data-src={image.image_url}
                            title={!isTouchDevice ? "Double click to zoom-in" : undefined}
                            alt={thing.name}
                            style={{ cursor: "zoom-in" }}
                        />
                        <em
                            className="zoomImage"
                            onClick={() => {
                                setZoomActive(false);
                                setSlideLocked(false);
                            }}
                            style={{
                                ...getZoomImageStyle(image, isZoomActive, zoomImageStyle),
                                backgroundColor: "white",
                                backgroundImage: `url(${zoomImageLoaded ? image.large_image_url : image.image_url})`,
                            }}
                        />
                        {isTouchDevice && <div className="swiper-lazy-preloader" />}
                    </>
                )}
            </SwiperSlide>
        );
    },
    (prevProps: ImageSlideProps, nextProps: ImageSlideProps) => {
        return prevProps.image.image_url === nextProps.image.image_url && prevProps.isActive === nextProps.isActive;
    }
);
ImageSlide.displayName = "SwiperSlide"; // This is important to make swiper to acknowledge it's actually slide, not some random components

const Image = ({ imageOnly = false, galleryThumbsDirection = "vertical", thumbsPerView = PER_PAGE }) => {
    const fancyProps = useFancy();
    const {
        thing,
        saleContext,
        slideContext: { thumbnailIndex },
    } = fancyProps;
    const swiperRef = useRef(null);
    const swipeThumbsRef = useRef(null);
    const [thumbIndex, setThumbIndex] = useState(0);
    const [slideLocked, setSlideLocked] = useState(false);
    const [swiper, setSwiper] = useState<null | SwiperClass>(null);
    const option = getCurrentSaleOption(thing.sales, saleContext, true);
    const images = getSaleImages(thing, option) as ThingImageOrVideo[];
    const lastThumbIndex = images.length - thumbsPerView;

    useEffect(() => {
        if (!swiper) {
            return;
        }
        if (thumbnailIndex != swiper.activeIndex) {
            swiper.slideTo(thumbnailIndex);
        }
        if (!imageOnly && swipeThumbsRef.current) {
            const thumbSwiper = swipeThumbsRef.current.swiper;
            if (!thumbSwiper.slides[thumbnailIndex].classList.contains("swiper-slide-visible"))
                thumbSwiper.slideTo(Math.min(thumbnailIndex, lastThumbIndex));
        }
    }, [thumbnailIndex, swiper, imageOnly]);

    useEffect(() => {
        if (!swipeThumbsRef.current) {
            return;
        }
        const swiper = swipeThumbsRef.current.swiper;
        if (thumbIndex != swiper.activeIndex) {
            swiper.slideTo(thumbIndex);
        }
    }, [thumbIndex, imageOnly]);

    const prevEl = (
        <div
            className={`prev ${thumbIndex > 0 ? "disabled" : ""}`}
            style={{ opacity: thumbIndex > 0 ? undefined : 0.3 }}
            onClick={() => setThumbIndex(Math.max(0, thumbIndex - thumbsPerView))}
        />
    );

    const nextEl = (
        <div
            className={`next ${thumbIndex < lastThumbIndex ? "disabled" : ""}`}
            style={{
                opacity: thumbIndex < lastThumbIndex ? undefined : 0.3,
            }}
            onClick={() => {
                setThumbIndex(Math.min(thumbIndex + thumbsPerView, lastThumbIndex));
            }}
        />
    );

    return (
        <div className="figure-section">
            <Swiper
                ref={swiperRef}
                onSlideChange={() => {
                    const swiper = swiperRef.current?.swiper;
                    if (swiper) {
                        fancyProps.dispatch(setThumbnailIndex(swiper.activeIndex));
                        setThumbIndex(swiper.activeIndex);
                    }
                }}
                preloadImages={false}
                lazy={{
                    loadPrevNext: true,
                    loadPrevNextAmount: 0,
                }}
                zoom={
                    isTouchDevice
                        ? {
                              maxRatio: 2,
                          }
                        : undefined
                }
                allowSlidePrev={!slideLocked}
                allowSlideNext={!slideLocked}
                onZoomChange={(_, scale) => {
                    if (scale > 1) {
                        setSlideLocked(true);
                    } else {
                        setSlideLocked(false);
                    }
                }}
                onSwiper={(swiper) => {
                    setSwiper(swiper);
                }}
                className="gallery-top">
                {images.map((image, i) => {
                    return (
                        <ImageSlide
                            key={i}
                            image={image}
                            i={i}
                            setSlideLocked={setSlideLocked}
                            isActive={swiper?.activeIndex === i}
                        />
                    );
                })}
                {!imageOnly && <ActionButtons />}
            </Swiper>
            {!imageOnly && prevEl}
            <Swiper
                className="gallery-thumbs"
                ref={swipeThumbsRef}
                onClick={() => {
                    if (!swipeThumbsRef.current) {
                        return;
                    }
                    fancyProps.dispatch(setThumbnailIndex(swipeThumbsRef.current.swiper.clickedIndex));
                }}
                direction={galleryThumbsDirection}
                spaceBetween={16}
                slidesPerView={thumbsPerView}
                watchSlidesVisibility={true}
                height={80}>
                {images.map((image, i) => {
                    return (
                        <SwiperSlide
                            key={i}
                            className={classnames({
                                "video-thumbnail": image.h264_1000k_url,
                                selected: i == thumbnailIndex,
                            })}>
                            <img
                                height="80"
                                src={placeholderImage}
                                style={{ backgroundImage: `url(${image.thumbnail_url})` }}
                            />
                        </SwiperSlide>
                    );
                })}
                {imageOnly && (
                    <>
                        {prevEl}
                        {nextEl}
                    </>
                )}
            </Swiper>
            {!imageOnly && nextEl}
        </div>
    );
};

export default Image;
