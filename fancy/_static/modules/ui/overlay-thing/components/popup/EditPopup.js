import React from "react";
import classnames from "classnames";
import { closePopup } from "fancyutils";
import { Display } from "fancymixin";

import { deleteThing } from "../../API";
import { isVideoUploadable } from "../map";

function onChangeSetState(key) {
    return function setStateWith(event) {
        this.setState({ [key]: event.target.value });
    };
}

const allowedVideoExtensions = ["mp4", "avi", "mov"];
const VideoUploadStatus = {
    Unknown: "Unknown", // fetching existing information
    Blank: "Blank",
    Uploading: "Uploading",
    UploadCompleted: "UploadCompleted"
};

function getVideoFilename(videoURL) {
    const videoFilenameSpl = videoURL.split("/");
    if (videoFilenameSpl.length > 1) {
        return videoFilenameSpl[videoFilenameSpl.length - 1];
    }
}

export default class EditPopup extends React.Component {
    static popupName = "edit-thing";
    __existingVideo = null;

    _getInitialState({ thing = {} } = { thing: {} }) {
        const selectedCategory = thing.category_item && thing.category_item.category_id - 1;
        this.__existingVideo = null;
        return {
            categoryDisplay: false,
            selectedCategory: selectedCategory >= 0 ? selectedCategory : null,
            thingName: thing.name || "",
            thingTagUrl: thing.tag_url || "",
            appDescription: (thing.metadata && thing.metadata.description) || "",
            videoStatus: VideoUploadStatus.Unknown,
            videoURL: "",
            showList: false,
            lists: []
        };
    }

    constructor(props) {
        super(props);
        this.state = this._getInitialState(props);
    }

    close() {
        closePopup(EditPopup.popupName);
    }

    isVideoUploadAllowed(thing) {
        return isVideoUploadable(thing);
    }

    updateVideoURL = ({ thing = {} } = { thing: {} }) => {
        if (this.isVideoUploadAllowed(thing)) {
            $.get(`/rest-api/v1/video_cover/thing/${thing.id}`)
                .fail(jqxhr => {
                    if (jqxhr.status === 404 && this.props.thing.id === thing.id) {
                        this.setState({ videoStatus: VideoUploadStatus.Blank });
                    }
                })
                .done(res => {
                    this.__existingVideo = res;
                    if (this.props.thing.id === thing.id) {
                        this.setState({
                            videoStatus: VideoUploadStatus.UploadCompleted,
                            videoURL: res.original
                        });
                    }
                });
        }
    };

    getSelectedCategoryName = () => {
        const { selectedCategory } = this.state;

        if (selectedCategory != null) {
            return Categories[selectedCategory].title;
        } else {
            return "Choose a Category";
        }
    };

    handleCategorySelection = event => {
        const idx = $(event.target).attr("data-idx");
        const numIdx = Number(idx);
        if (idx == null || numIdx === this.state.selectedCategory) {
            this.setState({ selectedCategory: null, categoryDisplay: false }); // force update
        } else {
            this.setState({ selectedCategory: numIdx, categoryDisplay: false }); // force update
        }
    };

    handleTrickClick = () => {
        this.setState({ categoryDisplay: false });
    };

    findFromRoot = selection => {
        return $(this.root).find(selection);
    };

    save = () => {
        const { thing } = this.props;
        if (this.state.selectedCategory == null) {
            alert("You should select a cagegory.");
            return;
        }
        var title = this.findFromRoot("#fancy-title")
            .val()
            .trim();
        var link = this.findFromRoot("#fancy-web-link")
            .val()
            .trim();
        var description = this.state.appDescription;
        var category = this.findFromRoot(".figure-infomation .lists-popout.category input:checked")
            .eq(0)
            .attr("data-formvalue");
        var thing_id = thing.id;
        var uid = thing.user.id;

        if (title.length <= 0) {
            alert(gettext("Please enter title."));
            return false;
        }
        if (title.length > 150) {
            alert(gettext("Title is too long."));
            return false;
        }

        var param = {
            name: title,
            link,
            description,
            thing_id,
            uid
        };
        if (category != "-1" && category != "-2") param["category"] = category;
        function update_callback(xml) {
            var $xml = $(xml),
                $st = $xml.find("status_code"),
                msg = $xml.find("message").text();
            if ($st.text() == "0") {
                alert(msg);
            } else if ($st.text() == "1") {
                location.href = $(xml)
                    .find("thing_url")
                    .text();
            } else if ($st.text() == "2") {
                if (confirm(msg)) {
                    param["ignore_dup_link"] = true;
                    $.post("/update_new_thing.xml", param, update_callback, "xml");
                }
            }
        }
        $.post("/update_new_thing.xml", param, update_callback, "xml");

        return false;
    };

    handleUpload = event => {
        event.preventDefault();
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        this.uploadInput.dispatchEvent(evt);
    };

    handleDelete = () => {
        deleteThing(this.props.thing, () => {
            this.close();
        });
    };

    handleFileUpload = () => {
        const { thing } = this.props;
        const inputEl = this.uploadInput;
        const fileVal = inputEl.value.trim();
        const thing_id = thing.id;
        const uid = thing.user.id;
        var $em = $(this.root).find(".progress > em");
        var $uploadButton = $(this.root).find("a.change-img");

        $em
            .css("width", "1px")
            .parent()
            .show();
        $uploadButton.hide();

        if (fileVal.length > 0) {
            import(/* webpackChunkName: "OverlayThing.admin" */'../../../../../_ui/js/ajaxfileupload')
            .then(function() {
                $.ajaxFileUpload({
                    url: "/newthing_image.xml?thing_id=" + thing_id + "&uid=" + uid,
                    secureuri: false,
                    fileElementId: inputEl.id,
                    dataType: "xml",
                    success: function(xml, status) {
                        var $xml = $(xml),
                            $st = $xml.find("status_code"),
                            $msg = $xml.find("message");
    
                        if ($st.length && $st.text() == "1") {
                            location.reload(false);
                        } else if ($st.length && $st.text() == "0") {
                            alert($msg.text());
                            return false;
                        } else {
                            alert(gettext("Unable to upload file."));
                            return false;
                        }
                    },
                    error: function(data, status, e) {
                        alert(e);
                        return false;
                    },
                    complete: function() {
                        $em.parent().hide();
                    },
                    progress: function(percent) {
                        $em.css("width", percent + "%");
                        $uploadButton.css("display", "");
                    }
                });
                $("#uploadphoto").attr("value", "");
            })
        }
        return false;
    };

    handleVideoUploadTrigger = () => {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        this.videoUploadInput.dispatchEvent(evt);
    };

    getExtension(filename) {
        const spl = filename.split(".");
        return spl[spl.length - 1];
    }

    handleVideoUpload = event => {
        const inputEl = this.videoUploadInput;
        const fileVal = inputEl.value.trim();
        const ext = this.getExtension(fileVal);
        const extensionIsAllowed = allowedVideoExtensions.some(ext => ext === ext);
        if (!extensionIsAllowed && !window.confirm(`Extension '.${ext}' is not allowed. Proceed?`)) {
            return false;
        }
        const { thing } = this.props;

        this.setState({ videoStatus: VideoUploadStatus.Uploading, videoURL: fileVal }, () => {
            const formData = new window.FormData();
            formData.append(inputEl.name, inputEl.files[0]);
            $.ajax({
                url: "/rest-api/v1/videos/videocontents",
                processData: false,
                contentType: false,
                type: "POST",
                data: formData
            })
                .success((res, status) => {
                    console.log("video update completed, registering cover...");
                    const contentType = "thing"; // TODO: +article, etc
                    const objectId = thing.id;
                    const video_id = res.id;

                    $.ajax({
                        url: `/rest-api/v1/video_cover/${contentType}/${objectId}`,
                        type: "PUT",
                        data: { video_id }
                    })
                        .success(res => {
                            this.setState({ videoStatus: VideoUploadStatus.UploadCompleted });
                            alert("cover registration complete");
                        })
                        .fail((data, status, e) => {
                            this.setState({ videoStatus: VideoUploadStatus.Blank });
                            alert(`${e}: failed to register cover.`);
                        });
                })
                .fail((data, status, e) => {
                    this.setState({ videoStatus: VideoUploadStatus.Blank });
                    alert(`${e}: failed to upload video. Please try again.`);
                });
        });
        return false;
    };

    handleRemoveVideo = () => {
        const { thing } = this.props;
        if (this.__existingVideo && window.confirm("Are you sure to delete attached video?")) {
            const video_id = this.__existingVideo.id;
            const contentType = "thing"; // TODO: +article, etc
            const objectId = thing.id;

            $.ajax({
                url: `/rest-api/v1/video_cover/${contentType}/${objectId}`,
                type: "DELETE",
                data: { video_id }
            })
                .success(res => {
                    this.setState(
                        {
                            videoStatus: VideoUploadStatus.Blank
                        }
                    );
                    console.log("Video cover successfully removed. Deleting video...");
                })
                .fail((data, status, e) => {
                    alert(`${e}: failed to delete cover.`);
                });
        } else if (this.__existingVideo == null) {
            alert("Error: video is not loaded completed. Please try again.");
        }
        return false;
    };

    handleSelectList = event => {
        event.preventDefault();
        this.setState({ showList: true });
    };

    componentDidMount() {
        this.__last_tid = this.props.thing.id;
        this.updateVideoURL(this.props);
    }

    componentDidUpdate() {
        console.debug(this.state);
        const np = this.props;
        if (this.__last_tid !== np.thing.id) {
            this.__last_tid = np.thing.id;
            this.setState(this._getInitialState(np), () => {
                this.updateVideoURL(np);
            });
        }
    }

    render() {
        const { appContext: { viewer }, thing } = this.props;
        const {
            appDescription,
            categoryDisplay,
            selectedCategory,
            thingName,
            thingTagUrl,
            videoStatus,
            videoURL
        } = this.state;

        return (
            <div ref={(element) => {this.root = element;}}>
                <p className="ltit">Edit thing</p>
                <div className="figure-infomation">
                    <p className="figure-img">
                        <em className="shadow" />
                        <a href="#" className="change-img" onClick={this.handleUpload}>
                            <i className="ic-pen" />
                            <small>
                                Change image<b />
                            </small>
                        </a>
                        <input
                            id="uploadphoto"
                            type="file"
                            ref={(element) => {this.uploadInput = element;}}
                            name="upload-file"
                            onChange={this.handleFileUpload}
                        />
                        <img
                            src="/_static/_ui/images/common/blank.gif"
                            style={{ backgroundImage: `url(${thing.image.src})` }}
                        />
                        <span className="progress" style={Display.None}>
                            <em style={{ width: "60%" }} />
                        </span>
                    </p>
                    <p>
                        <label>Title</label>
                        <input
                            type="text"
                            value={thingName}
                            className="text"
                            id="fancy-title"
                            onChange={onChangeSetState("thingName").bind(this)}
                        />
                    </p>
                    <p>
                        <label>Source</label>
                        <input
                            type="text"
                            className="text"
                            placeholder="http://"
                            value={thingTagUrl}
                            id="fancy-web-link"
                            onChange={onChangeSetState("thingTagUrl").bind(this)}
                        />
                    </p>
                    <p className="select-category">
                        <label>Category</label>
                        <a
                            className={classnames("select-category category", { focus: categoryDisplay })}
                            onClick={() => {
                                this.setState({ categoryDisplay: true });
                                return false;
                            }}>
                            {this.getSelectedCategoryName()}
                        </a>
                    </p>
                    <div className="lists-popout category" style={Display.BlockIf(categoryDisplay)}>
                        <span
                            className="trick"
                            style={Display.BlockIf(categoryDisplay)}
                            onClick={this.handleTrickClick}
                        />
                        <ul>
                            {Categories.map((c, idx) => (
                                <li key={idx}>
                                    <input
                                        type="checkbox"
                                        id={`category-${idx + 1}`}
                                        data-idx={idx}
                                        data-formvalue={c.formValue}
                                        onChange={this.handleCategorySelection}
                                        checked={selectedCategory === idx}
                                    />
                                    <label htmlFor={`category-${idx + 1}`}>{c.title}</label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {viewer.is_admin_content &&
                        this.isVideoUploadAllowed(thing) && (
                            <p>
                                <label>Item Video</label>
                                <button
                                    className="btns-white"
                                    onClick={this.handleVideoUploadTrigger}
                                    disabled={videoStatus === VideoUploadStatus.Unknown}
                                    style={Display.NoneIf(
                                        !(
                                            videoStatus === VideoUploadStatus.Blank ||
                                            videoStatus === VideoUploadStatus.Unknown
                                        )
                                    )}>
                                    Upload Video
                                </button>
                                <input
                                    type="file"
                                    name="video-file"
                                    id="video-file"
                                    ref={(element) => {this.videoUploadInput = element;}}
                                    onChange={this.handleVideoUpload}
                                    style={Display.None}
                                />
                                <span
                                    className={classnames("video_item", {
                                        loading:
                                            videoStatus === VideoUploadStatus.Uploading ||
                                            videoStatus === VideoUploadStatus.UploadCompleted
                                    })}
                                    style={Display.NoneIf(
                                        !(
                                            videoStatus === VideoUploadStatus.Uploading ||
                                            videoStatus === VideoUploadStatus.UploadCompleted
                                        )
                                    )}>
                                    <span>{getVideoFilename(videoURL)}</span>{" "}
                                    <a
                                        href="#"
                                        className="del"
                                        onClick={this.handleRemoveVideo}
                                        style={Display.NoneIf(videoStatus !== VideoUploadStatus.UploadCompleted)}>
                                        x
                                    </a>
                                </span>
                            </p>
                        )}
                </div>
                {thing.can_be_modified &&
                    thing.has_launch_app && (
                        <p className="note description">
                            <textarea
                                placeholder="App description"
                                id="fancy-description"
                                maxlength="200"
                                onChange={onChangeSetState("appDescription").bind(this)}
                                value={appDescription}
                            />
                        </p>
                    )}
                <div className="btn-area">
                    <button className="btns-gray-embo btn-delete remove_new_thing" onClick={this.handleDelete}>
                        <i className="ic-del" /> Delete item
                    </button>
                    <button className="btns-gray-embo btn-cancel" onClick={this.close}>
                        Cancel
                    </button>
                    <button className="btns-blue-embo btn-save" onClick={this.save}>
                        Save
                    </button>
                </div>
                <button className="ly-close" title="Close" onClick={this.close}>
                    <i className="ic-del-black" />
                </button>
            </div>
        );
    }
}

const Categories = [
    {
        formValue: "Mens",
        title: "Men's"
    },
    {
        formValue: "Womens",
        title: "Women's"
    },
    {
        formValue: "Kids",
        title: "Kids"
    },
    {
        formValue: "Pets",
        title: "Pets"
    },
    {
        formValue: "Home",
        title: "Home"
    },
    {
        formValue: "Gadgets",
        title: "Gadgets"
    },
    {
        formValue: "Art",
        title: "Art"
    },
    {
        formValue: "Food",
        title: "Food"
    },
    {
        formValue: "Media",
        title: "Media"
    },
    {
        formValue: "Other",
        title: "Other"
    },
    {
        formValue: "Architecture",
        title: "Architecture"
    },
    {
        formValue: "travel-and-destinations",
        title: "Travel & Destinations"
    },
    {
        formValue: "sports-and-outdoors",
        title: "Sports & Outdoors"
    },
    {
        formValue: "diy-and-crafts",
        title: "DIY & Crafts"
    },
    {
        formValue: "Workspace",
        title: "Workspace"
    },
    {
        formValue: "cars-and-vehicles",
        title: "Cars & Vehicles"
    }
];
