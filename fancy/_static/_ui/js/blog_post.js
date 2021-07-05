function resetCoverLoader() {
    $(".blog .cover .add.progress").removeClass("progress");
    $(".add .pbar-progress").width(0);
}

function confirmedRedirect(targetLocation) {
    $(window).off('beforeunload')
    location.href = targetLocation
}

// upgrade 50x50 -> 168(84x2)x168
function enhanceThumbnail(url, dimension) {
    return url.replace(/(resize\/)(.*)(\/thefancy)/, '$1' + dimension + 'x' + dimension + '$3')
}

var tinyMCE = window.tinyMCE;
var tinymce = window.tinyMCE;
var Backbone = window.Backbone;

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = ((n & 3) << 4) | (r >> 4);
            u = ((r & 15) << 2) | (i >> 6);
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            } else if (isNaN(i)) {
                a = 64;
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
        }
        return t;
    },
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = (s << 2) | (o >> 4);
            r = ((o & 15) << 4) | (u >> 2);
            i = ((u & 3) << 6) | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r);
            }
            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = Base64._utf8_decode(t);
        return t;
    },
    _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode((r >> 6) | 192);
                t += String.fromCharCode((r & 63) | 128);
            } else {
                t += String.fromCharCode((r >> 12) | 224);
                t += String.fromCharCode(((r >> 6) & 63) | 128);
                t += String.fromCharCode((r & 63) | 128);
            }
        }
        return t;
    },
    _utf8_decode: function(e) {
        var t = "";
        var n = 0;
        var r = (c1 = c2 = 0);
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
                n += 2;
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode(((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                n += 3;
            }
        }
        return t;
    }
};

var ProductView = Backbone.View.extend({
    events: {},
    renderDescriptionTextArea: function() {
        var dfd = $.Deferred();
        this.descriptEditorInitPromise = dfd.promise();
        tinyMCE.init({
            mode: "exact",
            elements: "main-editor",
            content_css: "/_ui/css/seller_brand_content.css",
            theme: "advanced",
            theme_advanced_toolbar_location: "top",
            theme_advanced_toolbar_align: "left",
            theme_advanced_buttons1:
                "bold,italic,underline,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,fontsizeselect,|,blockquote,link,unlink,|,code",
            theme_advanced_buttons2: "",
            theme_advanced_buttons3: "",
            theme_advanced_resizing: true,
            theme_advanced_font_sizes: "10px,12px,14px,16px,24px",
            theme_advanced_more_colors: false,
            browser_spellcheck: true,
            gecko_spellcheck: true,
            plugins: "paste, inlinepopups",
            paste_text_sticky: true,
            width: "620",
            height: "365",
            init_instance_callback: function() {
                dfd.resolve();
            },
            setup: function(editor) {
                editor.onInit.add(function(ed) {
                    ed.pasteAsPlainText = true;
                });
                editor.onExecCommand.add(function(editor, command) {
                    if (command != "mceInsertLink") return;
                    setTimeout(function() {
                        tinymce.map(editor.dom.select("a"), function(n) {
                            var href = editor.dom.getAttrib(n, "href") || "";
                            if (href.indexOf("/") !== 0) {
                                href = "http://" + href;
                                editor.dom.setAttrib(n, "href", href);
                                editor.dom.setAttrib(n, "data-mce-href", href);
                            }
                        });
                    }, 10);
                });
                // editor.addButton("addimagebutton", {
                //     title: "Add Image",
                //     icon: "addimagebutton",
                //     onclick: function() {
                //         window.openImageDialogHandler();
                //     }
                // });
            }
        });
    },
    onEditorWindowOpen: function() {
        var $wysiwyg = this.$el.find(".defaultSkin");
        var offset = $wysiwyg.offset();
        var width = $wysiwyg.width();
        var height = $wysiwyg.height();

        var editor = tinyMCE.activeEditor;
        editor.windowManager.features.left = offset.left;
        editor.windowManager.features.top = offset.top;
        editor.windowManager.features.width = width;
        editor.windowManager.features.height = height;
        editor.windowManager.params.mce_width = width;
        editor.windowManager.params.mce_height = height;
    },
    syncView: function() {
        var that = this;
        this.descriptEditorInitPromise.done(function() {
            tinyMCE.dom.Event.add(tinyMCE.activeEditor.getBody(), "focus", function(e) {
                that.$el.find(".defaultSkin").addClass("focus expand");
            });

            tinyMCE.dom.Event.add(tinyMCE.activeEditor.getBody(), "blur", function(e) {
                that.$el.find(".defaultSkin").removeClass("focus");
            });

            tinyMCE.activeEditor.windowManager.onOpen.add(function(e) {
                that.onEditorWindowOpen();
            }, that);

            $(window)
                .off("resize.editor")
                .on("resize.editor", function(e) {
                    var $wysiwyg = that.$el.find(".defaultSkin");
                    var offset = $wysiwyg.offset();
                    if (tinyMCE.activeEditor.windowManager.lastId) {
                        tinymce.DOM.setStyles(tinyMCE.activeEditor.windowManager.lastId.replace("_wrapper", ""), {
                            top: offset.top,
                            left: offset.left
                        });
                    }
                });

            $(document)
                .off("focus.editorlayer")
                .on("focus.editorlayer", ".clearlooks2[role=dialog] iframe", function(e) {
                    $(".clearlooks2[role=dialog] iframe").load(function() {
                        $(".clearlooks2[role=dialog]").attr(
                            "class",
                            "clearlooks2 " +
                                $(".clearlooks2[role=dialog] iframe")[0].contentWindow.document.body.getAttribute(
                                    "id"
                                ) || ""
                        );
                    });
                });
        });
    },
    initialize: function() {},
    render: function() {
        this.renderDescriptionTextArea();
        this.syncView();
        return this;
    }
});

$(function() {
    var alertify = window.alertify;
    var BlogAPI = {
        Image: "/rest-api/v1/seller/" + window.seller_id + "/images",
        Post: window.is_edit ? "/merchant/promote/blog_posts/update.json" : "/merchant/promote/blog_posts/create.json"
    };
    // var tinymce = window.tinymce;
    // // Editor init
    // tinymce.init({
    //     skin_url: "/_static/seller/css/settings/editor/fancy",
    // });
    new ProductView({
        el: $(".description"),
        model: {
            get() {
                return "";
            }
        }
    }).render();

    $(".setting .btn-switch").on("click", function() {
        $(this).toggleClass("on");
        return false;
    });

    window.currentCover = window.currentCover || {
        type: null,
        video_id: null,
        remove_video: false,
        cover_image_url: null
    };
    var currentCover = window.currentCover;
    // Submit
    $(".btn-save").on("click", function() {
        var $el = $(this);
        if ($el.attr("disabled")) {
            return;
        }
        $el.attr("disabled", true);

        var formData = new FormData();
        var data = getPostData();

        if (!data) {
            $el.attr("disabled", false);
            return;
        }

        for (var k in data) {
            formData.append(k, data[k]);
        }

        $.ajax({
            url: BlogAPI.Post + window.params_for_seller_dashboard,
            method: "POST",
            data: formData,
            contentType: false,
            processData: false
        })
            .then(function(res) {
                if (res.success) {
                    confirmedRedirect("/merchant/promote/blog_posts/edit" + window.params_for_seller_dashboard + "&id=" + res.blogpost_id);
                } else if (res.error) {
                    window.alertify.alert(res.error);
                }
            })
            .fail(function() {
                alertify.alert("Failed to save, please try again later.");
            })
            .always(function() {
                $el.attr("disabled", false);
            });

        return false;
    });

    // Submit
    $(".btn-preview").on("click", function() {
        var form = $("<form>").appendTo("body");
        var data = getPostData();
        if (!data) return;

        for (var k in data) {
            form.append($("<input type='hidden' name='" + k + "' value='" + data[k] + "'/>"));
        }
        form.attr("action", window.store_url + "/blog/preview");
        form.attr("target", "_blank");
        form.submit();
        return false;
    });

    function getPostData() {
        var title = $(".blog_cont .title input")
            .val()
            .trim();
        var tagline = $(".blog_cont .tagline input")
            .val()
            .trim();
        var content = Base64.encode(tinymce.activeEditor.getContent().trim());
        var is_active = $(".setting .btn-switch").is(".on");

        if (title === "") {
            alertify.alert("Please write title.");
            return;
        }

        if (tagline === "") {
            alertify.alert("Please write tagline.");
            return;
        }

        if (content === "") {
            alertify.alert("Please write content.");
            return;
        }

        var formData = {};
        formData["title"] = title;
        formData["tagline"] = tagline;
        formData["content"] = content;
        formData["is_active"] = is_active;

        if (window.post_id) {
            formData["blogpost_id"] = window.post_id;
        }
        if (currentCover.type === "video" && currentCover.video_id != null) {
            formData["video_id"] = currentCover.video_id;
        }
        if (currentCover.type === "image" && currentCover.cover_image_url != null) {
            formData["cover_image_url"] = currentCover.cover_image_url;
        }
        if (currentCover.type !== "video" && currentCover.remove_video) {
            formData["remove_video"] = true;
        }

        var sale_item_ids;
        sale_item_ids = $(".post .items .item")
            .map(function(i, e) {
                return $(e).attr("data-sid");
            })
            .toArray();
        if (sale_item_ids) {
            formData["sale_item_ids"] = JSON.stringify(sale_item_ids);
        }
        var slug = $(".slug_input")
            .val()
            .trim();
        if (slug) {
            formData["slug"] = slug;
        }
        return formData;
    }

    $(".cover li.add-input, .btn-change-cover").on("click", function() {
        $("#cover-file").click();
    });

    function removeCover() {
        if (currentCover.type === "image") {
            var $img = $("#cover-img");
            $img.data("file", null);
            $img.attr("src", "");
            $img.hide();
        } else if (currentCover.type === "video") {
            var $vid = $("#cover-video");
            $vid.data("file", null);
            $vid.attr("src", "");
            $vid.hide();
            currentCover.remove_video = true;
        }
        currentCover.type = null;
        currentCover.video_id = null;
        currentCover.cover_image_url = null;
        // UI
        $(".cover .additional").show();
        $(".update-cover").hide();
    }
    $(".btn-delete-cover").on("click", removeCover);

    function uploadCoverImage(file) {
        removeCover();
        currentCover.type = "image";
        uploadImage(file, function(cover_image_url) {
            resetCoverLoader();
            currentCover.cover_image_url = cover_image_url;

            $(".cover ul.additional").hide();
            var $img = $("#cover-img");
            $img.hide();
            var reader = new FileReader();
            reader.onload = function(progressEvent) {
                $img.data("file", file);
                $img.attr("src", progressEvent.target.result);
                $img.show();
                $(".update-cover").show();
            };
            reader.readAsDataURL(file);
        });
    }

    function uploadCoverVideo(videoFile) {
        removeCover();
        currentCover.type = "video";
        var formData = new FormData();
        formData.append("video-file", videoFile);
        $.ajax({
            url: "/rest-api/v1/videos/videocontents" + window.params_for_seller_dashboard,
            processData: false,
            contentType: false,
            type: "POST",
            data: formData,
            xhr: function() {
                return createXhr(
                    function() {
                        $(".cover ul.additional .add").addClass("progress");
                    },
                    function(e) {
                        var progressCss = String(90 * (e.loaded / e.total)) + "%";
                        $(".add .pbar-progress").css("width", progressCss);
                    },
                    resetCoverLoader
                );
            }
        })
            .success(function(res, status) {
                console.log("handleVideoUpload -> success", res, status);
                currentCover.video_id = res.id;
                currentCover.remove_video = false;
                new VideoReadyCheckPoll(res.id, function(checkRes) {
                    var url = checkRes.outputs.h264_400k.url;
                    var $vid = $("#cover-video");
                    $vid.attr("src", url);
                    resetCoverLoader();
                    $(".cover .additional").hide();
                    $vid.show();
                    $(".update-cover").show();
                });
            })
            .fail(function(data, status, e) {
                console.warn("handleVideoUpload -> fail", data, status);
                alert(e + ": failed to upload video. Please try again.");
                resetCoverLoader();
            });
    }

    $("#cover-file").on("change", function() {
        var file = this.files[0];
        // input is image
        if (file.type.startsWith("image/")) {
            uploadCoverImage(file);
            // input is video
        } else if (file.type.startsWith("video/")) {
            uploadCoverVideo(file);
        } else {
            alertify.alert("This file is not supported type.");
            return;
        }
        $("#cover-file").val("");
    });

    // Add image library
    $(".setting .additional .add:eq(0)").on("click", function() {
        $("#upload-file").click();
    });

    function resetImageLibraryLoader() {
        $(".setting .image_loader .infscr-loading").hide();
        $(".setting .image_loader .infscr-loading .loading-bar").width(0);
    }

    function createFakeLoader() {
        var html =
            '<li class="add image_loader" style="display: table;">' +
            '<a href="#"><em class="infscr-loading" style="display: none;"><span class="loading">Loading<i class="loading-bar"></i></span></em></a>' +
            "</li>";
        return $(html);
    }

    function uploadImageToLibrary(files, callback) {
        var formData = new FormData();
        var fs = [].slice.call(files);
        fs.forEach(function(f) {
            formData.append("image-file", f);
            $(".setting .additional").append(createFakeLoader());
        });

        $.ajax({
            url: "/rest-api/v1/seller/" + window.seller_id + "/images" + window.params_for_seller_dashboard,
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            xhr: function() {
                return createXhr(
                    function() {
                        $(".setting .additional .image_loader .infscr-loading").show();
                    },
                    function(e) {
                        var progressCss = String(90 * (e.loaded / e.total)) + "%";
                        $(".setting .additional .image_loader .infscr-loading .loading-bar").css("width", progressCss);
                    },
                    resetImageLibraryLoader
                );
            }
        })
            .then(function(images) {
                $(".setting .additional .image_loader").remove();
                var template = $("#photo-template").html();
                if (callback) {
                    callback(images);
                }
                _.each(images, function(image) {
                    updateImageLibrary(image);
                    $(".setting .additional").append(
                        _.template(template, {
                            iid: image.id,
                            original_url: image.image_url,
                            thumbnail_url: enhanceThumbnail(image.thumbnail_image_url, 168),
                            filename: image.name,
                            alt: (image.metadata && image.metadata.alt) || '',
                            description: (image.metadata && image.metadata.description) || '',
                        })
                    );
                });
                refreshImageUI();
            })
            .always(function() {
                // reset loader
                resetImageLibraryLoader();
            });
        return false;
    }

    $("#upload-file").on("change", function() {
        uploadImageToLibrary(this.files);
    });

    $("#container-wrapper").on("click", function(event) {
        var targ = event.target;
        var popupNeedsToBeClosed =
            $(".overlay_container").is(".insert_img") && $(targ).closest(".overlay_container")[0] == null;
        if (popupNeedsToBeClosed) {
            closeImageDialog();
        }
    });

    // Select image library
    $(document.body)
        .on("click", ".setting .additional li.photo.item", function() {
            var $el = $(this);
            if ($el.is(".selected")) {
                closeImageDialog();
                return;
            } else {
                $(".setting .additional li.photo.item.selected").removeClass("selected");
                $el.addClass("selected");
            }
            // image
            var p_edge_offset_hor = 8;
            var ofs = $el.offset();
            var li_h = $el.height() / 2;

            var $popup = $(".overlay_container .insert_img");
            var p_w = $popup.width() + p_edge_offset_hor;
            var p_h = $popup.height() / 2;

            $popup.css("left", ofs.left - p_w);
            $popup.css("top", ofs.top - p_h + li_h);
            // setup popup
            $(".overlay_container #insert-image").css(
                "background-image",
                "url('" + enhanceThumbnail($el.find("img").data("thumbnail-url"), 316) + "')"
            );
            var ins = getInsertion();
            // if (ins) {
            $("#insert-image-x").val(ins.width);
            $("#insert-image-y").val(ins.height);
            if (ins.metadata && ins.metadata.alt) {
                $("#insert-alt-text").val(ins.metadata.alt);
            }
            if (ins.metadata && ins.metadata.description) {
                $("#insert-image-description").val(ins.metadata.description);
            }
            // }
            $(".overlay_container #insert-image").data("proportion", Number($("#insert-image-x").val()) / Number($("#insert-image-y").val()))
            // display popup
            openImageDialog();
            return false;
        })
        .on("mouseover", ".setting .additional li.photo.item", function() {
            var $el = $(this);
            // console.log("nextWidth", $el.find("i").width() / 2, -($el.find("i").width() / 2 + 10));
            $el.find("i").css("margin-left", -($el.find("i").width() / 2 + 10));
        })
        .on(
            "keyup",
            ".setting .search input",
            debounceUntilTimeout(
                function(event) {
                    retrieveImages(event.target.value.trim());
                },
                500,
                null
            )
        );

    $(".overlay_container .insert_img")
        .on("click", ".image-area .btn-del", function() {
            var original_labels = alertify.labels
            alertify.set({
                labels: {
                    ok     : "Cancel",
                    cancel : "Delete"
                }
            });
            alertify.confirm('Are you sure you want to delete this image?', function(val){
                if (!val) {
                    var $el = $(".setting .additional li.photo.item.selected")
                    $.ajax({
                        method: "DELETE",
                        url:
                            "/rest-api/v1/seller/" +
                            window.seller_id +
                            "/images/" +
                            $el.data("iid") +
                            window.params_for_seller_dashboard
                    })
                        .then(function() {
                            closeImageDialog();
                            $el.remove();
                            if ($(".setting .additional li.photo.item").length === 0) {
                                if (
                                    $(".setting .search input")
                                        .val()
                                        .trim().length === 0
                                ) {
                                    refreshImageUI();
                                }
                            }
                        })
                        .fail(function() {
                            alertify.alert("Failed to delete.");
                        });
                }
            });
            alertify.set({labels: original_labels})
            return false;
        })
        .on("click", "#insert-image", function() {
            return false;
        })
        .on("click", "#insert-image-submit", function() {
            var ins = getInsertion();
            var url;
            var alt = $("#insert-alt-text").val();
            var description = $("#insert-image-description").val();

            var metadata = null
            if (alt) {
                metadata = metadata || {}
                metadata.alt = alt
                ins.metadata.alt = alt
            }
            if (description) {
                metadata = metadata || {}
                metadata.description = description
                ins.metadata.description = description
            }
            if (metadata) {
                $.ajax({
                    url: "/rest-api/v1/seller/" + window.seller_id + "/images/" + ins.id + window.params_for_seller_dashboard,
                    method: "PUT",
                    data: metadata,
                    dataType: 'json',
                })
                .then(function(res) {
                    console.log('update complete:', res)
                })
            }

            // if (ins) {
                url = ins.image_url;
            // } else {
            //     url = $("#insert-image-url")
            //         .val()
            //         .trim();
            //     if (!url) {
            //         alertify.alert("Please choose an image from library or specify URL for attached image.");
            //         return;
            //     }
            // }
            var img = $("<img />", { src: url, alt: alt, title: description });
            var w = Number($("#insert-image-x").val());
            var h = Number($("#insert-image-y").val());
            if (w && h) {
                img.width(w);
                img.height(h);
            }
            closeImageDialog();
            tinymce.activeEditor.execCommand("mceInsertContent", false, img.prop("outerHTML"));
        })
        .on("click", "#insert-image-upload", function() {
            return false
        })
        .on("change", "#insert-image-x", function() {
            var prop = $(".overlay_container #insert-image").data("proportion");
            $("#insert-image-y").val((this.value / prop) | 0);
        })
        .on("keyup", "#insert-image-x, #insert-image-y", function(event) {
            if (event.which === 13) {
                $(this).blur();
            }
        })
        .on("change", "#insert-image-y", function() {
            var prop = $(".overlay_container #insert-image").data("proportion");
            $("#insert-image-x").val((this.value * prop) | 0);
        });

    var lastId;
    function retrieveImages(qstr, callback) {
        // get seller blog images.
        var url = BlogAPI.Image + window.params_for_seller_dashboard;
        if (qstr) {
            url += "&qstr=" + qstr;
        }
        var lastIdLocal = String(Math.random());
        lastId = lastIdLocal;
        $.get(url).then(function(res) {
            if (lastIdLocal !== lastId) {
                return;
            }
            if (res.images && res.images.length > 0) {
                var template = $("#photo-template").html();
                $(".setting .additional .photo.item").remove();
                $(".setting .additional").data("imagesearch", res   .images);
                _.each(res.images, function(image) {
                    updateImageLibrary(image);
                    $(".setting .additional").append(
                        _.template(template, {
                            iid: image.id,
                            original_url: image.image_url,
                            thumbnail_url: enhanceThumbnail(image.thumbnail_image_url, 168),
                            filename: image.name,
                            alt: (image.metadata && image.metadata.alt) || '',
                            description: (image.metadata && image.metadata.description) || '',
                        })
                    );
                });
            } else {
                $(".setting .additional .photo.item").remove();
            }
            if (callback) {
                callback();
            }
        });
    }
    // function refreshImageUI(refreshSearchInput) {
    function refreshImageUI() {
        if ($(".setting .additional .photo.item").length > 0) {
            $(".setting .search").show();
        } else {
            // if search is involved, remove search
            // if (refreshSearchInput && $('.setting .search input').val().length > 0) {
            //     $('.setting .search input').val('').trigger('keyup');
            // } else {
            $(".setting .search").hide();
            // }
        }
    }
    retrieveImages(null, function() {
        refreshImageUI();
    });

    var imageLibrary = {}; // { [id: Number]: ImageObject }
    function updateImageLibrary(imageObject) {
        imageLibrary[imageObject.id] = imageObject;
    }
    window.imageLibrary = imageLibrary

    function getInsertion() {
        var selected = $(".setting .additional .photo.selected");
        var id = selected.data("iid"); // FIXME: use `id`
        if (id == null) {
            return;
        }
        return imageLibrary[id];
    }

    function openImageDialog() {
        $(".overlay_container").addClass("insert_img");
    }

    function closeImageDialog() {
        $(".overlay_container").removeClass("insert_img");
        $(".setting .additional li.photo.item.selected").removeClass("selected");
        onCloseImageDialog();
    }

    // clear all data
    function onCloseImageDialog() {
        $("#insert-image-url").val("");
        $("#insert-image-x").val("");
        $("#insert-image-y").val("");
        $("#insert-image-description").val("");
        $("#insert-alt-text").val("");
    }

    // Add Collection Item
    var $loader = $(".add_collection_item .products .loading");
    // var selectedProduct = null;

    // function contextify(url) {
    //     var attachments;
    //     if (location.args.seller_id) {
    //         attachments = attachments || {};
    //         attachments["seller_id"] = location.args.seller_id;
    //     }

    //     if (attachments) {
    //         url += (url.indexOf("?") === -1 ? "?" : "&") + $.param(attachments);
    //     }
    //     return url;
    // }

    // auto-height  textarea
    $(".store_updates textarea.update_text").each(function() {
        this.setAttribute("style", "height:" + (this.scrollHeight || 46) + "px;overflow-y:hidden;");
    });

    var productsCache = {};
    var cursor = null;
    var initialized = false;
    var searchResult = [];
    window.searchResult = searchResult;

    function search(keyword) {
        var deferred;
        keyword = keyword || "";
        lastKeyword = keyword;
        if (cursor === "!") {
            deferred = $.when({
                status_code: 1,
                products: searchResult
                    .map(function(id) {
                        return productsCache[id];
                    })
                    .filter(function(product) {
                        if (keyword) {
                            return product.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
                        } else {
                            return true;
                        }
                    }),
                cached: true
            });
        } else {
            var url =
                "/merchant/promote/store_updates/search-items.json" +
                window.params_for_seller_dashboard +
                "&keyword=" +
                keyword;
            if (cursor) {
                url += "&cursor=" + (cursor || "");
            }
            deferred = $.get(url);
        }
        $loader.show();

        deferred.then(function(result) {
            if (result.status_code === 1) {
                if (result.cursor) {
                    cursor = result.cursor;
                } else {
                    cursor = "!";
                }
                addProducts(result.products, result.cached);
            } else {
                console.warn("Adding product error:", result);
                window.alertify.alert("There was an error, please try again.");
            }
            $loader.hide();
        });
    }

    var addedItemIds = {};
    var lastKeyword = "";
    $(".popup.add_collection_item")
        .on(
            "keyup",
            ".search input",
            debounceUntilTimeout(
                function() {
                    var keyword = $(".popup.add_collection_item .search input")
                        .val()
                        .trim();
                    if (keyword !== lastKeyword) {
                        cursor = null;
                        emptyList();
                    }
                    search(keyword);
                },
                500,
                null
            )
        )
        .on("click", ".products li", function() {
            var $el = $(this);
            if ($el.is(".selected")) {
                $el.removeClass("selected");
            } else {
                $el.addClass("selected");
            }
        })
        .on("click", ".btn-add", function() {
            var $el = $(".add_collection_item .products li.selected");
            if ($el.length > 0) {
                this.disabled = true;
                var itemsView = $(".post .items ul.additional");

                $el.each(function(i, e) {
                    var sid = $(e).attr("id");
                    var product = productsCache[sid];
                    if (product && !addedItemIds[sid]) {
                        addedItemIds[sid] = true;
                        $(
                            '<li class="photo item" data-sid="' +
                                product.id +
                                '">' +
                                '<a class="preview"><img src="//static-ec1.thefancy.com/_ui/images/common/blank.gif"' +
                                'style="background-image:url(' +
                                product.image +
                                ')"></a>' +
                                '<a href="#" class="btns-gray-embo btn-del">Delete</a>' +
                                "</li>"
                        ).appendTo(itemsView);
                    }
                });
                $el.removeClass("selected");
                this.disabled = false;
                closeItemPopup();
            } else {
                alert("Please select item first.");
            }
        })
        .on("click", ".popup-close", function() {
            closeItemPopup();
        })
        .on("click", ".btn-cancel", function() {
            closeItemPopup();
        })
        .find(".products")
        .on(
            "scroll",
            _.throttle(function() {
                if (cursor === "!") {
                    return;
                }
                var $el = $(this);
                // console.log(
                //     $el.prop("scrollHeight"), $el.prop("clientHeight"), $el.prop("scrollTop"),
                //     ($el.prop("scrollHeight") - $el.prop("clientHeight") - $el.prop("scrollTop")) < 60
                // );
                if (
                    !$loader.is(":visible") &&
                    $el.prop("scrollHeight") - $el.prop("clientHeight") - $el.prop("scrollTop") < 60
                ) {
                    var keyword = $(".popup.add_collection_item .search input")
                        .val()
                        .trim();
                    if (keyword.length > 0) {
                        search(keyword);
                    } else {
                        search();
                    }
                }
            }, 100)
        );

    function closeItemPopup() {
        $.dialog("add_collection_item").close();
    }

    function cacheProduct(product) {
        if (productsCache[product.id] === undefined) {
            productsCache[product.id] = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image
            };
        }
    }

    function emptyList() {
        var $list = $(".add_collection_item .products");
        $list.children().each(function(i, e) {
            if (!$(e).is($loader)) {
                e.remove();
            }
        });
    }

    function addProducts(products, isCached, empty) {
        if (empty) {
            // remove without loader
            emptyList();
        }
        products.forEach(function(product) {
            $(
                '<li id="' +
                    product.id +
                    '"><a href="#"><img src="/_ui/images/common/blank.gif" style="background-image: url(' +
                    product.image +
                    ');"><span class="title">' +
                    product.title +
                    '</span><span class="price">$' +
                    product.price +
                    "</span></a></li>"
            ).insertBefore($loader);
            if (!isCached) {
                cacheProduct(product);
            }
        });
        if (!isCached) {
            _.extend(
                searchResult,
                products.map(function(product) {
                    return product.id;
                })
            );
        }
    }

    function initializeSearch() {
        var deferred;
        if (initialized) {
            return;
            // deferred = $.when({
            //     status_code: 1,
            //     products: searchResult.map(function(id) {
            //         return productsCache[id];
            //     }),
            //     cached: true
            // });
        } else {
            initialized = true;
            deferred = $.get("/merchant/promote/store_updates/search-items.json" + window.params_for_seller_dashboard);
        }

        $loader.show();
        deferred.then(function(result) {
            if (result.status_code === 1) {
                var empty = false;
                if (cursor === null) {
                    empty = true;
                }
                if (result.cursor) {
                    cursor = result.cursor;
                } else {
                    cursor = "!";
                }
                addProducts(result.products, result.cached, empty);
            } else {
                console.warn("Adding product error:", result);
                window.alertify.alert("There was an error, please try again.");
            }
            $loader.hide();
        });
    }

    $(".post .items .additional .add").on("click", function() {
        initializeSearch();
        $.dialog("add_collection_item").open();
        return false;
    });

    var wscrolltop;
    var isWebkit = navigator.userAgent.indexOf("AppleWebKit") > -1 && navigator.userAgent.indexOf("Chrome") === -1;
    var sortableOptions = {
        cancel: ".add"
    };

    // This is caused by jumpy helper - it can be also fixed by disabling overflow-y for the moment sorting.
    // https://stackoverflow.com/questions/2483943/jquery-ui-sortable-listitem-jumps-to-top-in-safari-and-chrome
    if (isWebkit) {
        sortableOptions.start = function(event, ui) {
            wscrolltop = $(window).scrollTop();
        };
        sortableOptions.sort = function(event, ui) {
            ui.helper.css({ top: ui.position.top + wscrolltop + "px" });
        };
    }

    $(".post .items .additional")
        .sortable(sortableOptions)
        .on("click", ".btn-del", function() {
            var $li = $(this).closest("li");
            delete addedItemIds[$li.data("sid")];
            $li.remove();
            return false;
        });
    // due to flexible id character length
    $(".blog .setting .set .slug_input").css("padding-left", $(".blog .setting .set .url span").width() + 7);

    // drag & drop
    $(".setting > .wrapper")
        .on("drop", function(e) {
            e.preventDefault();
            var dt = e.originalEvent.dataTransfer;
            var files;
            if (dt.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < dt.items.length; i++) {
                    if (dt.items[i].kind == "file") {
                        var items = [].slice.call(dt.items);
                        files = items.map(function(item) {
                            return item.getAsFile();
                        });
                    }
                }
            } else {
                // Use DataTransfer interface to access the file(s)
                for (var i = 0; i < dt.files.length; i++) {
                    files = dt.files;
                }
            }
            uploadImageToLibrary(files);
        })
        .on("dragover", function(e) {
            e.preventDefault();
        })
        .on("dragend", function(e) {
            e.preventDefault();
            // Remove all of the drag data
            // var dt = e.dataTransfer;
            // if (dt.items) {
            //     // Use DataTransferItemList interface to remove the drag data
            //     for (var i = 0; i < dt.items.length; i++) {
            //         dt.items.remove(i);
            //     }
            // } else {
            //     // Use DataTransfer interface to remove the drag data
            e.originalEvent.dataTransfer.clearData();
            // }
        })
        .on("dragleave", function(e) {
            e.preventDefault();
            // Remove all of the drag data
            var dt = e.originalEvent.dataTransfer;
            if (dt.items) {
                // Use DataTransferItemList interface to remove the drag data
                for (var i = 0; i < dt.items.length; i++) {
                    dt.items.remove(i);
                }
            } else {
                // Use DataTransfer interface to remove the drag data
                e.originalEvent.dataTransfer.clearData();
            }
        });
    $('.save .btn-cancel').on('click', function() {
        // WARNING: Due to limitation of alertify, ok and cancel is reversed.
        var original_labels = alertify.labels
        if (window.is_edit) {
            alertify.set({
                labels: {
                    ok     : "Continue Editing",
                    cancel : "Discard Changes"
                }
            });
            alertify.confirm('Are you sure you want to discard your changes?', function(val){
                if (!val) {
                    confirmedRedirect('/merchant/promote/blog_posts');
                }
            });
        } else {
            alertify.set({
                labels: {
                    ok     : "Continue Editing",
                    cancel : "Discard"
                }
            });
            alertify.confirm('Are you sure you want to discard this post?', function(val){
                if (!val) {
                    confirmedRedirect('/merchant/promote/blog_posts');
                }
            });
        }
        alertify.set({labels: original_labels})
    });

    $(window).on('beforeunload', function (e) {
        var msg = 'Are you sure you want to leave this page? Your changes may not be saved.'
        e.returnValue = msg
        return msg
    })
});

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var VideoReadyCheckPoll = (function() {
    function VideoReadyCheckPoll(videoId, callback, timeout) {
        _classCallCheck(this, VideoReadyCheckPoll);

        this.videoId = null;
        this.timeout = 1000;
        this.callback = null;
        this.requesting = false;
        this.timerId = null;

        this.videoId = videoId;
        this.callback = callback;
        if (timeout) {
            this.timeout = timeout;
        }
        this.start();
    }

    _createClass(VideoReadyCheckPoll, [
        {
            key: "start",
            value: function start() {
                var _this = this;

                if (this.requesting) {
                    return;
                }
                this.requesting = true;
                this.timerId = setInterval(function() {
                    $.get("/rest-api/v1/videos/videocontents/" + _this.videoId)
                        .then(function(res) {
                            _this.requesting = false;
                            console.log("video ready status:", res.status);
                            if (_this.timerId != null && res.status === "ready" && res.pending_job === null) {
                                _this.clear();
                                var cb = _this.callback;
                                cb(res);
                            }
                        })
                        .fail(function(xhr) {
                            _this.clear();
                            console.warn("video ready poll error:", xhr);
                        });
                }, this.timeout);
            }
        },
        {
            key: "clear",
            value: function clear() {
                clearInterval(this.timerId);
                this.timerId = null;
            }
        }
    ]);

    return VideoReadyCheckPoll;
})();

// Libs
function debounceUntilTimeout(fun, delay) {
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var timer;
    return function delayedFunctionWrapper() {
        clearTimeout(timer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        args.unshift(context);
        timer = setTimeout(fun.bind.apply(fun, args), delay);
    };
}

function createXhr(onStart, onLoading, resetLoader) {
    if (onStart) {
        onStart();
    }
    var xhr = new XMLHttpRequest();
    // xhr.upload.addEventListener("load", resetLoader);
    xhr.upload.addEventListener("error", resetLoader);
    xhr.upload.addEventListener("abort", resetLoader);
    xhr.upload.addEventListener(
        "progress",
        function(e) {
            if (onLoading) onLoading(e);
        },
        false
    );
    return xhr;
}

var loading = false;
function uploadImage(file, callback) {
    if (loading) {
        return;
    }
    loading = true;

    if (!file) {
        loading = false;
        alert(gettext("Please select a file to upload"));
        return false;
    }

    if (!/([^\\\/]+\.(jpe?g|png|gif))$/i.test(file.name || file.filename)) {
        loading = false;
        alert(gettext("The image must be in one of the following formats: .jpeg, .jpg, .gif or .png."));
        return false;
    }

    var filename = RegExp.$1;
    var xhr = createXhr(
        function() {
            $(".cover ul.additional .add").addClass("progress");
        },
        function(e) {
            var progressCss = String(90 * (e.loaded / e.total)) + "%";
            $(".add .pbar-progress").css("width", progressCss);
        },
        resetCoverLoader
    );
    xhr.onreadystatechange = function() {
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
            callback(json.image.url);
            // json.image
            // this.handleUploadImageComplete(json);
        }
        loading = false;
    };

    xhr.open("POST", "/upload_cover_image.json?max_width=1200&filename=" + filename, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-Filename", encodeURIComponent(filename));
    xhr.send(file);
}
