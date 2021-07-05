import React from "react";
import { Display } from "fancymixin";
import { formatDuration } from "fancyutils";
import { Video } from "common-components";

import { toggleUpload } from "./LocalUtils";


function getExtension(filename) {
    const spl = filename.split(".");
    return spl[spl.length - 1];
}

const allowedVideoExtensions = ["mp4", "avi", "mov"];
const VideoUploadStatus = {
    Unknown: "Unknown", // fetching existing information
    Blank: "Blank",
    Uploading: "Uploading",
    VideoOnProcess: "VideoOnProcess",
    UploadCompleted: "UploadCompleted",
    UploadFailed: "UploadFailed"
};

class VideoReadyCheckPoll {
    videoId = null;
    timeout = 1000;
    callback = null;
    requesting = false;

    constructor(videoId, callback, timeout) {
        this.videoId = videoId;
        this.callback = callback;
        if (timeout) {
            this.timeout = timeout;
        }
        this.start();
    }

    timerId = null;
    start() {
        if (this.requesting) {
            return;
        }
        this.requesting = true;
        this.timerId = setInterval(() => {
            $.get(`/rest-api/v1/videos/videocontents/${this.videoId}`)
                .then(res => {
                    this.requesting = false;
                    console.log("video ready status:", res.status);
                    if (this.timerId != null && res.status === "ready" && res.pending_job === null) {
                        this.clear();
                        const cb = this.callback;
                        cb(res);
                    }
                })
                .fail(xhr => {
                    this.clear();
                    console.warn("video ready poll error:", xhr);
                });
        }, this.timeout);
    }

    clear() {
        clearInterval(this.timerId);
        this.timerId = null;
    }
}

export default class CoverImage extends React.Component {
    FullWidth = 970;

    state = {
        loading: false,
        loaderPx: null,
        videoPlaying: false
    };

    componentDidMount() {
        if (this.getImageType() === "cover_video") {
            const cover = this.getCoverObject();
            let videoStatus;
            switch (cover.status) {
                case 0:
                case 1:
                    videoStatus = VideoUploadStatus.VideoOnProcess;
                    this.createVideoReadyPoll(cover.id);
                    break;
                case 2:
                    videoStatus = VideoUploadStatus.UploadCompleted;
                    break;
                case 3:
                    videoStatus = VideoUploadStatus.UploadFailed;
                    break;
            }
            this.setState({ videoStatus });
        }
    }

    handleInsertCoverImage = _ => {
        toggleUpload(this.imageUploadInput);
    };

    handleInsertCoverVideo = _ => {
        toggleUpload(this.videoUploadInput);
    };

    handleImageUpload = event => {
        if (this.state.loading) {
            return;
        }
        if (event.target.files.length === 0) {
            return;
        }
        const targ = event.target;
        this.toggleLoading(true, () => {
            //const filename = fuzzyNameSplitter(event.target.value);
            this.uploadImage(targ);
        });
    };

    baseLoaderPx = -132;
    handleProgress = (loaded, total) => {
        const loaderPx = this.baseLoaderPx + -this.baseLoaderPx * loaded / total;
        this.setState({ loaderPx });
    };

    reset = null;
    resetLoader = () => {
        if (this.reset) {
            return;
        }
        this.reset = setTimeout(() => {
            this.setState({ loaderPx: 0 }, () => {
                this.toggleLoading(false, () => {
                    this.setState({ loaderPx: null });
                });
            });
        }, 300);
    };

    createXhr = () => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("load", this.resetLoader);
        xhr.upload.addEventListener("error", this.resetLoader);
        xhr.upload.addEventListener("abort", this.resetLoader);
        xhr.upload.addEventListener(
            "progress",
            e => {
                this.handleProgress(e.loaded, e.total);
            },
            false
        );
        return xhr;
    };

    uploadImage = fileInput => {
        var file_form = fileInput;
        var file;

        var filelist = file_form.files || (file_form.value ? [{ name: file_form.value }] : []);
        if (filelist && filelist.length) {
            file = filelist[0];
        }

        if (!file) {
            this.toggleLoading(false);
            alert(gettext("Please select a file to upload"));
            return false;
        }

        if (!/([^\\\/]+\.(jpe?g|png|gif))$/i.test(file.name || file.filename)) {
            this.toggleLoading(false);
            alert(gettext("The image must be in one of the following formats: .jpeg, .jpg, .gif or .png."));
            return false;
        }

        var filename = RegExp.$1;
        const xhr = this.createXhr();
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            } else if (xhr.readyState === 4 && (xhr.responseText == null || xhr.responseText === "")) {
                return;
            }

            if (xhr.status === 200) {
                // success
                var data = xhr.responseText;
                var json;
                try {
                    json = window.JSON.parse(data);
                } catch (e) {
                    try {
                        json = new Function("return " + data)();
                    } catch (ee) {
                        json = null;
                    }
                }
                this.handleUploadImageComplete(json);
            } else {
                this.toggleLoading(false);
            }
        };

        xhr.open("POST", "/upload_cover_image.json?max_width=1200&filename=" + filename, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("X-Filename", encodeURIComponent(filename));
        xhr.send(file);
    };

    toggleLoading(loading, callback) {
        if (loading === this.state.loading) {
            if (callback) {
                callback();
            }
        } else {
            const nextState = { loading };
            if (loading === true) {
                nextState.tempImage = {
                    url: window.blankUrl,
                    width: this.FullWidth,
                    height: 246
                };
            }
            callback = callback || function() {};
            this.setState(nextState, callback);
        }
    }

    // Fancy.CoverImage._uploadComplete
    handleUploadImageComplete({ image }) {
        this.toggleLoading(false, () => {
            this.setState({ tempImage: null });
            this.props.setArticleProp("cover_image", image);
        });
    }

    videoReadyPoll = null;
    createVideoReadyPoll = videoId => {
        this.videoReadyPoll = new VideoReadyCheckPoll(videoId, res => {
            this.props.setArticleProp("cover_video.thumbnail_url", res.thumbnail);
            this.props.setArticleProp("cover_video.autoplay", res.autoplay);
            this.props.setArticleProp("cover_video.loop", res.loop);

            try {
                this.props.setArticleProp("cover_video.duration", res.outputs.h264_400k.duration);
                this.props.setArticleProp("cover_video.url", res.outputs.h264_400k.url);
                this.props.setArticleProp("cover_video.width", res.outputs.h264_400k.width);
                this.props.setArticleProp("cover_video.height", res.outputs.h264_400k.height);
            } catch (e) {
                console.warn(e);
                window.alertify("unable to set uploaded cover. Please save and reload to see correct result.");
            }

            this.setState({
                tempImage: null,
                videoStatus: VideoUploadStatus.UploadCompleted
            });
        });
    };

    handleVideoUpload = event => {
        if (this.state.loading) {
            return;
        }
        if (event.target.files.length === 0) {
            return;
        }
        if (this.videoReadyPoll) {
            this.videoReadyPoll.clear();
        }
        this.toggleLoading(true, () => {
            const inputEl = this.videoUploadInput;
            const fileVal = inputEl.value.trim();
            const ext = getExtension(fileVal);
            const extensionIsAllowed = allowedVideoExtensions.some(ext => ext === ext);
            if (!extensionIsAllowed && !window.confirm(`Extension '.${ext}' is not allowed. Proceed?`)) {
                return false;
            }

            this.setState({ videoStatus: VideoUploadStatus.Uploading }, () => {
                const formData = new window.FormData();
                formData.append("video-file", inputEl.files[0]);
                $.ajax({
                    url: "/rest-api/v1/videos/videocontents",
                    processData: false,
                    contentType: false,
                    type: "POST",
                    data: formData,
                    xhr: this.createXhr
                })
                    .success((res, status) => {
                        console.log("handleVideoUpload -> success", res, status);
                        //const video_id = res.id;
                        this.setState({ videoStatus: VideoUploadStatus.VideoOnProcess });
                        this.props.setArticleProp("cover_video.id", res.id);
                        this.props.setArticleProp("remove_video", null);
                        this.createVideoReadyPoll(res.id);
                    })
                    .fail((data, status, e) => {
                        console.warn("handleVideoUpload -> fail", data, status);
                        this.setState({ videoStatus: VideoUploadStatus.Blank });
                        alert(`${e}: failed to upload video. Please try again.`);
                    })
                    .always(() => {
                        this.toggleLoading(false);
                    });
            });
        });
        return false;
    };

    getCoverObject() {
        const s = this.state;
        const p = this.props;
        return s.tempImage || (p.cover_video && p.cover_video.thumbnail_url && p.cover_video) || p.cover_image;
    }

    getImage() {
        const cover = this.getCoverObject();
        if (this.state.tempImage) {
            return cover.url;
        } else if (this.props.cover_video && this.props.cover_video.thumbnail_url) {
            return cover.thumbnail_url;
        } else if (this.props.cover_image) {
            return cover.url;
        } else {
            return "";
        }
    }

    getImageType() {
        if (this.state.loading) {
            return "loading";
        }

        if (this.state.tempImage) {
            return "tempImage";
        } else if (this.props.cover_video && this.props.cover_video.thumbnail_url) {
            return "cover_video";
        } else if (this.props.cover_image) {
            return "cover_image";
        }
    }

    getImageDimension() {
        const cover = this.getCoverObject();
        let w, h;
        if (cover) {
            w = cover.width;
            h = cover.height;
        }

        const style = { width: `${this.FullWidth}px`, widthNumber: w };
        if (w != null && h != null) {
            const proportion = this.FullWidth / w;
            style.height = `${proportion * h}px`;
            style.heightNumber = proportion * h;
        } else {
            style.height = `246px`;
        }
        return style;
    }

    handleRemove = event => {
        event.stopPropagation();
        const type = this.getImageType();
        if (type === "cover_video") {
            this.props.setArticleProp("cover_video", null);
            this.props.setArticleProp("remove_video", true);
        } else if (type === "cover_image") {
            this.props.setArticleProp("cover_image", null);
        }
    };

    handleLoopChange = event => {
        event.stopPropagation();
        this.props.setArticleProp("cover_video.loop", event.target.checked);
    };

    handleAutoplayChange = event => {
        event.stopPropagation();
        this.props.setArticleProp("cover_video.autoplay", event.target.checked);
    };

    handleCoverImageRemove = event => {
        event.stopPropagation();
        this.props.setArticleProp("cover_image", null);
    };

    render() {
        const { loading, videoStatus, videoPlaying } = this.state;

        const { cover_image } = this.props;
        const imageType = this.getImageType();
        const image = this.getImage();
        const cover = this.getCoverObject();
        const coverImageStyle = {};

        if (image) {
            const imageDimension = this.getImageDimension();
            coverImageStyle.backgroundImage = `url(${image})`;
            if (imageDimension.widthNumber != null && imageDimension.widthNumber > 970) {
                coverImageStyle.backgroundSize = imageDimension.width;
                coverImageStyle.height = imageDimension.height;
            }
        }

        const loaderPx = this.state.loaderPx != null ? `${this.state.loaderPx}px` : null;

        // view converted model values
        let autoplay = false;
        let loop = false;
        let duration = null;
        if (cover) {
            autoplay = cover.autoplay === true;
            loop = cover.loop === true;
            if (imageType === "cover_video") {
                duration = formatDuration(cover.duration);
            } else {
                duration = formatDuration(0);
            }
        }

        const coverImageThumbnailStyle = {};
        // Thumbnail image when cover video and cover image coexists.
        if (imageType === "cover_video" && cover_image) {
            coverImageThumbnailStyle.backgroundImage = `url(${cover_image.url})`;
        } else {
            coverImageThumbnailStyle.display = "none";
        }

        let objectForVideo;
        if (imageType === "cover_video" && videoStatus === VideoUploadStatus.UploadCompleted) {
            objectForVideo = {
                cover_video: {
                    original_url: cover.url,
                    thumbnail_url: cover.thumbnail_url,
                    loop: cover.loop,
                    status: "ready"
                }
            };
        }

        let heightMaker; // set height by inserting ghost <img />
        if (imageType === "cover_image") {
            heightMaker = <img className="height-maker" src={image} />;
        }

        return (
            <div className="inner-wrapper" onClick={this.handleClick}>
                <div id="coverImage" className={"cover purple " + (image ? "img-filled" : '')}>
                    <div className="cover-image-thumbnail" style={coverImageThumbnailStyle} title="Cover image">
                        <a className="remove" onClick={this.handleCoverImageRemove} title="Remove cover image" />
                    </div>
                    <div
                        className={`add ${imageType !== "loading" && image ? "img-filled" : "blank"} ${
                            loading ? "loading" : ""
                        }`}
                        style={coverImageStyle}>
                        {imageType === "cover_video" && [
                            <span
                                key="video-autoplay"
                                className="video-autoplay"
                                onClick={event => {
                                    event.stopPropagation();
                                }}>
                                <input
                                    type="checkbox"
                                    className="video-autoplay-value"
                                    id="video-autoplay-value"
                                    defaultChecked="checked"
                                    checked={autoplay}
                                    onChange={this.handleAutoplayChange}
                                />
                                <label htmlFor="video-autoplay-value">Autoplay</label>
                            </span>,
                            <span
                                key="video-loop"
                                className="video-loop"
                                onClick={event => {
                                    event.stopPropagation();
                                }}>
                                <input
                                    type="checkbox"
                                    className="video-loop-value"
                                    id="video-loop-value"
                                    defaultChecked="checked"
                                    checked={loop}
                                    onChange={this.handleLoopChange}
                                />
                                <label htmlFor="video-loop-value">Loop Video</label>
                            </span>,
                            <span key="video-time" className="time">
                                {duration}
                            </span>
                        ]}
                        {objectForVideo && (
                            <Video
                                object={objectForVideo}
                                display={true}
                                autoplay={false}
                                allow={{ showInfoAlways: true }}
                                onPause={() => {
                                    this.setState({ videoPlaying: false });
                                }}
                                onPlay={() => {
                                    this.setState({ videoPlaying: true });
                                }}
                            />
                        )}
                        {videoStatus === VideoUploadStatus.VideoOnProcess && (
                            <div className="video-wait-banner">Processing video...</div>
                        )}
                        {heightMaker}
                        <i className="loader" style={{ backgroundPosition: loaderPx }} />
                        <small
                            className="add_option_tools"
                            style={Display.NoneIf(videoPlaying || videoStatus === VideoUploadStatus.VideoOnProcess)}>
                            <a onClick={this.handleInsertCoverImage}>{window.isWhitelabelV2 ? 'Upload article image' : 'Insert Cover Image'}</a>
                            <a onClick={this.handleInsertCoverVideo}>{window.isWhitelabelV2 ? 'Upload article video' : 'Insert Cover Video'}</a>
                            <input
                                type="file"
                                id="cover-image"
                                ref={element => {
                                    this.imageUploadInput = element;
                                }}
                                onChange={this.handleImageUpload}
                                style={Display.None}
                                accept="image/*"
                            />
                            <input
                                type="file"
                                id="cover-video"
                                ref={element => {
                                    this.videoUploadInput = element;
                                }}
                                onChange={this.handleVideoUpload}
                                style={Display.None}
                                accept="video/*"
                            />
                        </small>
                    </div>
                    {image !== "" && <a className="remove" onClick={this.handleRemove} />}
                </div>
            </div>
        );
    }
}
