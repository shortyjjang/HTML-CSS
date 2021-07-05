import React from "react";
// import classnames from "classnames";
// import { proportionFormat, isSafari as isSafariUtil } from "fancyutils";
import { Display } from "fancymixin";

export function getVideo(object) {
    if (object.h264_1000k_url) return object;
    const saleVideo = object && object.sales && object.sales.video;
    const thingOrArticleVideo = (object && object.video_cover) || (object && object.cover_video);
    if (saleVideo) {
        return saleVideo;
    } else if (thingOrArticleVideo) {
        try {
            if (!thingOrArticleVideo.h264_1000k_url && object.cover_video.outputs.h264_1000k) {
                thingOrArticleVideo.h264_1000k_url = object.cover_video.outputs.h264_1000k.url;
            }
        } catch (e) {}
        return thingOrArticleVideo;
    } else if (object.metadata && object.metadata.video_url) {
        return {
            thumbnail_url: object.image.src,
            original_url: object.metadata.video_url
        };
    } else {
        console.warn("<Video /> component is mounted but with unknown type");
        return {};
    }
}

export class Video extends React.Component {
    constructor(props) {
        super(props);
        this.id = +new Date();
    }
    el = null;
    videoEl = null;
    static isVideoAvailableForThing(thing) {
        let thingHasVideo = false;
        if (thing) {
            if (thing.video_cover) {
                thingHasVideo = true;
            } else if (thing.metadata) {
                if (thing.metadata.video_url) {
                    thingHasVideo = true;
                }
            } else if (thing.sales) {
                if (thing.sales.video) {
                    thingHasVideo = true;
                }
            }
        }
        return thingHasVideo;
    }
    static isVideoAvailableForArticle(article) {
        if (article && article.cover_video && article.cover_video.status == "ready") {
            return true;
        } else {
            return false;
        }
    }

    getSrc() {
        const { object } = this.props;
        const video = getVideo(object);
        return video.h264_1000k_url || video.original_url || video.original;
    }

    getThumbnail() {
        const { object } = this.props;
        const video = getVideo(object);
        return video.thumbnail_url;
    }

    getLoop() {
        const { object } = this.props;
        return getVideo(object).loop;
    }

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.lastFullyRenderedObjectID !== this.props.lastFullyRenderedObjectID ||
            nextProps.display !== this.props.display ||
            nextProps.playing !== this.props.playing ||
            nextProps.object !== this.props.object);
    }

    prepare() {
        const domCls = `video-${this.id}`;
        let $el = $(`.${domCls}`);
        if ($el.length) {
            if ($el[0].src !== this.getSrc()) {
                $el[0].src = this.getSrc();
                $el[0].loop = !!this.getLoop();
                $el[0].currentTime = 0;
            }
        } else {
            $el = $(
                `<video id="myVideo" class="${domCls}" preload="auto" playsInline disablePictureInPicture autoplay muted controls controlslist="nodownload nofullscreen noremoteplayback" src="${this.getSrc()}" loop="${!!this.getLoop()}" poster="${this.getThumbnail()}"/>`
            )
                .on("ended", function() {
                    this.currentTime = 0;
                })
            this.videoEl = $el.get(0);
            $(this.el).empty().append(this.videoEl);
        }
    }

    componentDidUpdate(prevProps) {
        const np = this.props;
        if (np.display !== prevProps.display) {
            if (np.display === false) {
                this.videoEl && this.videoEl.pause();
            } else {
                this.videoEl && this.videoEl.play();
            }
        }
        if (np.display && np.playing != prevProps.playing) {
            if (np.playing === false) {
                this.videoEl && this.videoEl.pause();
            } else {
                this.videoEl && this.videoEl.play();
            }
        }
        this.prepare();
    }

    render() {
        const { display, style = {}, playing } = this.props;
        
        return (
            <div
                style={_.extend(style, Display.NoneIf(!display))}
                className="video_player nozoom"
                ref={el => {
                    this.el = el;
                    if (!this.videoEl) {
                        this.prepare();
                    }
                }}
            />
        );
    }
}
