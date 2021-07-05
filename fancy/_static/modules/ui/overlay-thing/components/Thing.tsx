import React, { Component } from "react";
import assign from "object-assign";
import classnames from "classnames";
import { schemeless, isEmpty, promisifiedFetchImage, renderPopup, minmax, getLocationArgPairs } from "fancyutils";
import { Display } from "fancymixin";
import { Video } from "common-components";

import { deleteThing } from "../API";
import { setThumbnailIndex } from "../action/actions";
import { updateSaleContext } from "../action/action-helpers";
import { getCurrentSaleOption, getSaleItemId, getDetailType, getSaleImages, getSeller } from "./map";
import { ItemDetail } from "./ThingDetails";
import { StaticThingViewConfig, ThingViewConfig } from "../config";
import { OverlayPropsV1 } from "ftypes";

const { zoomMargin, zoomBoxSize, zoomScale } = ThingViewConfig;
const { ThumbnailsLimit } = StaticThingViewConfig;

export default class Thing extends Component<OverlayPropsV1, {
    loaded: boolean,
    zoom: boolean,
    zoomImageStyle: Object,
    thumbnailsLimit: number
}> {
    transitionDuration = 350;
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            zoom: false,
            zoomImageStyle: Display.None,
            thumbnailsLimit: ThumbnailsLimit.Basic
        };
        $(window).on("resize.ThingView", () => {
            ThingViewConfig.boundarySize = $("#overlay-thing .figure-item figure:visible").width();
        });
    }

    componentDidMount() {
        $(window).trigger("resize.ThingView");
    }

    _isRequestFresh = (savedTID: string) => {
        return !this.state.loaded && savedTID === this.props.thing.id;
    };

    changeFigureTo = (index, saleOptionID) => {
        const tid = this.props.thing.id;
        if (saleOptionID) {
            this.props.dispatch(updateSaleContext({ saleOptionID }));
        }
        if (index !== this.props.slideContext.thumbnailIndex && this.state.loaded === true) {
            this.setState({ loaded: false }, () => {
                setTimeout(() => {
                    if (this._isRequestFresh(tid)) {
                        this.props.dispatch(setThumbnailIndex(index));
                        promisifiedFetchImage(
                            this.getImage(index).src,
                            () => {
                                if (this._isRequestFresh(tid)) {
                                    this.setState({ loaded: true });
                                }
                            },
                            1500
                        );
                    }
                }, this.transitionDuration);
            });
        }
    };

    getAbsoluteIndex = diff => {
        var {
            thing,
            thing: { sales },
            slideContext,
            saleContext
        } = this.props;
        const option = getCurrentSaleOption(sales, saleContext, true);
        var thingImagesLength = getSaleImages(thing, option).length;
        var nextIndex = slideContext.thumbnailIndex + diff;
        var ret;
        // => end of index reached (reversed)
        if (nextIndex < 0) {
            ret = (nextIndex + thingImagesLength) % thingImagesLength;
            // => end of index reached
        } else if (nextIndex >= thingImagesLength) {
            ret = 0;
        } else {
            ret = nextIndex % thingImagesLength;
        }
        return ret;
    };

    handlePrev = event => {
        event.preventDefault();
        event.stopPropagation();
        this.changeFigureTo(this.getAbsoluteIndex(-1));
    };

    handleNext = event => {
        event.preventDefault();
        event.stopPropagation();
        this.changeFigureTo(this.getAbsoluteIndex(+1));
    };

    isZoomable = () => {
        const { boundarySize } = ThingViewConfig;
        return this.getImage().width > boundarySize;
    };

    // Calculate zoomed image dimension.
    getZoomImageDimension = img => {
        const { boundarySize } = ThingViewConfig;
        return {
            width: boundarySize * zoomScale + zoomMargin,
            height: ((boundarySize * img.height) / img.width) * zoomScale + zoomMargin
        };
    };

    // TODO: cache
    getImageMeta = img => {
        const { boundarySize } = ThingViewConfig;
        let width, height, marginHoriz, marginVert;

        // responsive encoding
        // - regular mode
        const $fig = $("#overlay-thing .figure-item figure");
        if ($(window).width() > 700) {
            width = $fig.width();
            height = $fig.height();
            marginHoriz = 0;
            if (width > height) {
                marginHoriz = 0;
                marginVert = (boundarySize - height) / 2;
            } else {
                marginHoriz = (boundarySize - width) / 2;
                marginVert = 0;
            }
        // - mobile mode
        } else {
        }
        return { width, height, marginHoriz, marginVert };
    };

    moveZoomImage = (pageX, pageY) => {
        const { boundarySize } = ThingViewConfig;
        const $wrapper = $(this.wrapper);
        const img = this.getImage();
        const meta = this.getImageMeta(img);

        const offset = $wrapper.offset();
        const left = pageX - offset.left;
        const top = pageY - offset.top;

        // Fishy
        const topPosition = top - (boundarySize - meta.height) / 2;
        let showZoomImage;
        if ($(window).width() <= 700) {
            showZoomImage = false;
        } else {
            showZoomImage = left > 0 && topPosition > 0 && topPosition < meta.height;
        }

        var zoomImageStyle;
        if (showZoomImage) {
            const zd = this.getZoomImageDimension(img);
            const zoomImageContainerX = minmax(
                left - zoomMargin,
                meta.marginHoriz,
                meta.marginHoriz + meta.width - zoomBoxSize
            ); // 0 need to be fixed
            const zoomImageContainerY = minmax(
                top - zoomMargin,
                meta.marginVert,
                meta.marginVert + meta.height - zoomBoxSize
            ); // 0 need to be fixed

            const backgroundLeft = (zd.width * left) / boundarySize - zoomMargin;
            const backgroundTop = (zd.height * top) / boundarySize - zoomMargin;

            const bgPosX = -minmax(backgroundLeft, 0, zd.width - zoomBoxSize);
            const bgPosY = -minmax(backgroundTop, 0, zd.height - zoomBoxSize);

            zoomImageStyle = {
                left: `${zoomImageContainerX}px`,
                top: `${zoomImageContainerY}px`,
                backgroundPosition: `${bgPosX}px ${bgPosY}px`,
                display: "inline"
            };
        } else {
            zoomImageStyle = Display.None;
        }
        this.setState({ zoomImageStyle }); // FIXME
    };

    handleZoomBGClick = event => {
        event.preventDefault();
        event.stopPropagation();
        if (this.isZoomable()) {
            const nextZoom = !this.state.zoom;
            this.setState({ zoom: nextZoom });
            if (nextZoom) {
                this.moveZoomImage(event.pageX, event.pageY);
            }
        }
    };

    handleZoomBGMouseMove = ({ pageX, pageY }) => {
        // TODO: deactivate event on video thing
        if (this.state.zoom) {
            this.moveZoomImage(pageX, pageY);
        }
    };

    // Disable zoom mode when zoom mode is on.
    handleZoomImageClick = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ zoom: false });
    };

    getImage = () => {
        const {
            thing,
            thing: { sales },
            slideContext: { thumbnailIndex },
            saleContext
        } = this.props;
        const { thumbnailsLimit } = this.state;
        const option = getCurrentSaleOption(sales, saleContext, true);
        const saleImages = getSaleImages(thing, option, thumbnailsLimit);
        if (saleImages.length > thumbnailIndex) {
            return saleImages[thumbnailIndex];
        } else {
            return saleImages[0];
        }
    };

    getImageURL = () => {
        const image = this.getImage();
        return `url(${schemeless(image.src)})`;
    };

    // Set zoomed image's style
    getZoomImageStyle() {
        var ret = {};
        if (this.isZoomable() && this.state.zoom) {
            const img = this.getImage();
            const zd = this.getZoomImageDimension(img);
            assign(ret, this.state.zoomImageStyle, {
                backgroundSize: `${zd.width}px ${zd.height}px`,
                backgroundImage: `url(${img.src})`
            });
        } else {
            ret.display = "none";
        }

        return ret;
    }

    getBGImageStyle = () => {
        const { boundarySize } = ThingViewConfig;
        const style = {
            backgroundImage: this.getImageURL(),
            opacity: this.state.loaded ? 1 : 0,
        };

        if (this.props.slideContext.thumbnailIndex !== 0) {
            style.lineHeight = `${boundarySize - 2}px`;
            style.height = boundarySize;
        }

        return style;
    };

    shouldVideoDisplayed = () => {
        const currentThumbIsVideo = this.getImage().thumbType === "video";
        return currentThumbIsVideo;
    };

    isFit() {
        return this.getImage().width > 640 || this.props.slideContext.thumbnailIndex === 0;
    }

    handleThumbnailsLimitChange = thumbnailsLimit => {
        this.setState({ thumbnailsLimit });
    };

    handleEdit = () => {
        const { appContext, thing } = this.props;
        import(/* webpackChunkName: "OverlayThing.popup" */'./popup/index')
            .then(({ EditPopup }) => {
                renderPopup(EditPopup, { appContext, thing });
            });
    };

    handleDelete = event => {
        event.preventDefault();
        event.stopPropagation();
        deleteThing(this.props.thing);
    };

    // to keep image boundary as limit of height 640px
    // https://app.asana.com/0/260912680807/231933133767205
    MaxDimension = 640;
    getBoundaryImageStyle = () => {
        let { width, height } = this.getImage();
        // let dominant;
        if (height > width) {
            if (height > this.MaxDimension) {
                width = width / (height / this.MaxDimension);
                height = this.MaxDimension;
            }
        }
        return _.extend(
            {
                width,
                height
            },
            Display.NoneIf(this.shouldVideoDisplayed())
        );
    };

    // second-positioned vids need to be vertically centered.
    // https://app.asana.com/0/260912680807/506063369708942/f
    handleVideoStyle = () => {
        if (this.props.slideContext.thumbnailIndex !== 0 && this.shouldVideoDisplayed()) {
            return {
                top: `${($("#overlay-thing .figure-item .figure").height() -
                    $("#overlay-thing .video_player").height()) /
                    2}px`
            };
        }
        return {};
    };

    componentDidUpdate(nextProps) {
        const thumbnailChanged = nextProps.slideContext.thumbnailIndex !== this.props.slideContext.thumbnailIndex;
        if (thumbnailChanged && nextProps.slideContext.thumbnailIndex > this.state.thumbnailsLimit - 1) {
            this.handleThumbnailsLimitChange(ThumbnailsLimit.More);
        }
    }

    render() {
        var {
            appContext: { viewer, lastFullyRenderedThingID },
            thing,
            thing: { sales, META },
            saleContext
        } = this.props;
        var type = getDetailType(thing);

        // Admin sale item view
        var saleItemId = getSaleItemId(thing, viewer);
        var seller = getSeller(thing);
        var showZoom = this.isZoomable();
        const option = getCurrentSaleOption(sales, saleContext, true);

        const videoDisplay = this.shouldVideoDisplayed();
        // show prev/next arrow only for sale items
        var prevNextStyle;
        if (
            META.PlainThing ||
            META.LaunchApp ||
            getSaleImages(thing, option, 2).length !== 2 // When image is only 1 (or possibly 0)
        ) {
            prevNextStyle = Display.None;
        }
        return (
            <div
                className="wrapper figure-section"
                ref={element => {
                    this.wrapper = element;
                }}>
                <div className={classnames("figure-item", { video: videoDisplay })}>
                    <figure>
                        <span
                            onClick={this.handleZoomBGClick}
                            onMouseMove={this.handleZoomBGMouseMove}
                            className={classnames("figure", {
                                startZoom: this.state.zoom,
                                zoomShow: showZoom,
                                loading: thing.loading
                            })}
                            style={this.getBGImageStyle()}>
                            {Video.isVideoAvailableForThing(thing) && (
                                <Video
                                    object={thing}
                                    display={videoDisplay}
                                    lastFullyRenderedObjectID={lastFullyRenderedThingID}
                                    allow={{ fullScreen: true }}
                                    style={this.handleVideoStyle()}
                                />
                            )}
                            <em
                                className="zoomImage"
                                onClick={this.handleZoomImageClick}
                                style={this.getZoomImageStyle()}
                            />
                            <img
                                src={schemeless(this.getImage().src)}
                                className={this.isFit() ? "fit" : undefined}
                                style={this.getBoundaryImageStyle()}
                                alt={thing.emojified_name || thing.name}
                            />
                            <a onClick={this.handlePrev} className="prev" style={prevNextStyle} />
                            <a onClick={this.handleNext} className="next" style={prevNextStyle} />
                        </span>
                        {!isEmpty(thing.user) && !isEmpty(thing.user.username) && (
                            <span className="submitted">
                                Submitted by <b>{thing.user.username}</b>
                            </span>
                        )}
                        <span className="figure-button">
                            {saleItemId &&
                                seller &&
                                (viewer.is_admin_senior ||
                                    viewer.is_admin_business ||
                                    viewer.is_admin_brand ||
                                    viewer.is_admin_cs) && (
                                    <a
                                        href={`/merchant/products/${saleItemId}/edit?seller_id=${seller.id}`}
                                        className="edit_sale"
                                        target="_blank">
                                        {gettext("Edit Sale")} <small>({gettext("Moderator")})</small>
                                    </a>
                                )}
                            {!isEmpty(sales) &&
                                (viewer.id == seller.id && !(viewer.is_admin_senior || viewer.is_admin_business)) && (
                                    <a href={`/merchant/products/${sales.id}/edit`} className="edit_sale" target="_blank">
                                        {gettext("Edit Sale")}
                                    </a>
                                )}
                            {(thing.can_be_modified || viewer.is_admin_content || viewer.is_admin_business) && (
                                <a className="edit" onClick={this.handleEdit}>
                                    {gettext("Edit")}
                                </a>
                            )}
                            {((!isEmpty(thing.user) &&
                                thing.user.username != null &&
                                thing.user.username === viewer.username) ||
                                viewer.is_admin_senior ||
                                viewer.is_admin_business) && (
                                <a className="remove_new_thing delete" onClick={this.handleDelete}>
                                    {gettext("Delete item")}
                                </a>
                            )}
                        </span>
                    </figure>
                    {type && (
                        <ItemDetail
                            {...this.props}
                            type={type}
                            handleChangeFigure={this.changeFigureTo}
                            thumbnailsLimit={this.state.thumbnailsLimit}
                            onThumbnailsLimitChange={this.handleThumbnailsLimitChange}
                        />
                    )}
                </div>
            </div>
        );
    }
}
