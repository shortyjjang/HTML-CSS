$(function() {
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

    var isPopupView = $(".btn-area .post-store_update").attr("data-popup-view") === "true";
    var sellerId = $(".btn-area .post-store_update").attr("data-seller-id");
    var $loader = $(".add_collection_item .products .loading");
    var selectedProduct = null;

    function contextify(url) {
        var attachments;
        if (location.args.seller_id) {
            attachments = attachments || {};
            attachments["seller_id"] = location.args.seller_id;
        }
        if (attachments) {
            url += (url.indexOf("?") === -1 ? "?" : "&") + $.param(attachments);
        }
        return url;
    }

    $(".add_img_hidden").on("change", function() {
        var $image = $(".store_updates .add .image");
        $image.hide();
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function(readerEvent) {
            $image.data("file", file);
            $image.data("filename", file.name);
            $image.find("img").attr("src", readerEvent.target.result);
        };
        reader.readAsDataURL(file);
        $image.show();
    });

    $(".store_updates .image .remove").on("click", function() {
        var $image = $(".store_updates .add .image");
        $image.hide();
        $image.find("img").attr("src", "");
        $image.data("file", null);
        $image.data("filename", null);
    });

    $(".popup.store_updates")
        .on("click", ".view-post", function() {
            location.href = "/merchant/promote/store_updates";
        })
        .on("click", ".exit-store_update", function() {
            $.dialog("store_updates").close();
        });

    // auto-height  textarea
    $(".store_updates textarea.update_text").each(function() {
        this.setAttribute("style", "height:" + (this.scrollHeight || 46) + "px;overflow-y:hidden;");
    });

    var uploading = false;
    $(".store_updates")
        // auto-height  textarea
        .on("input", "textarea.update_text", function() {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight || 46) + "px";
        })
        .on("click", ".btn-area .add_item", function() {
            initializeSearch();
            $.dialog("add_collection_item").open();
            return false;
        })
        .on("click", ".btn-area .add_img", function() {
            $(".add_img_hidden").click();
        })
        .on("click", ".btn-area .post-store_update", function() {
            if (uploading) {
                return;
            }
            var $el = $(this);
            var formData = new FormData();
            var updateText = $(".store_updates .update_text")
                .val()
                .trim();
            formData.append("text", updateText);

            if(!updateText){
                alertify.alert("Please input update message");
                return;
            }

            if (selectedProduct != null) {
                formData.append("sale_item_id", selectedProduct.id);
            }

            var coverImage = $(".store_updates .add .image").data("file");
            if (coverImage) {
                formData.append("upload-file", coverImage);
            }

            $el.addClass("disabled _loading");
            uploading = true;
            
            $.ajax({
                url: contextify("/rest-api/v1/seller/" + sellerId + "/merchant_posts"),
                method: "POST",
                data: formData,
                contentType: false,
                processData: false
            })
                .then(function() {
                    if (isPopupView) {
                        $(".popup.store_updates")
                            .find(".add")
                            .hide()
                            .end()
                            .find(".complete")
                            .show();
                        $.dialog("store_updates").center();
                    } else {
                        location.reload();
                    }
                })
                .fail(function(xhr) {
                    console.warn("Error store update:", xhr);
                    window.alertify.alert("Failed to submit store update. Please try again later.");
                })
                .always(function() {
                    uploading = false;
                    $el.removeClass("disabled _loading");
                });
        })
        // store updates page
        .on("click", ".view .btn-del", function() {
            var $el = $(this);
            window.alertify.confirm("Are you sure you want to remove this post?", function(confirmation) {
                if (!confirmation) {
                    return;
                }
                // send delete request for model
                var postId = $el.closest(".view").data("post-id");
                $.ajax({
                    url: contextify("/rest-api/v1/seller/" + sellerId + "/merchant_posts/" + postId),
                    method: "DELETE"
                })
                    .then(function() {
                        location.reload();
                    })
                    .fail(function() {
                        window.alertify.alert("There was an error while removing the post. Please try again later");
                    });
            });
            return false;
        })
        .on("click", ".view .btn-remove_product", function() {
            var $el = $(this);
            window.alertify.confirm("Are you sure you want to remove this product?", function(confirmation) {
                if (!confirmation) {
                    return;
                }
                // send delete request for model rel
                var postId = $el.closest(".view").data("post-id");
                $.ajax({
                    url: contextify("/rest-api/v1/seller/" + sellerId + "/merchant_posts/" + postId),
                    method: "PUT",
                    data: {
                        is_partial: true,
                        sale_item_id: null
                    }
                })
                    .then(function() {
                        location.reload();
                    })
                    .fail(function(xhr) {
                        console.warn("Error remove product:", xhr);
                        window.alertify.alert("There was an error while removing the product. Please try again later");
                    });
            });
            return false;
        })
        .on("click", ".remove-product-select", function() {
            selectedProduct = null;
            var itemView = $(".store_updates .add .item");
            itemView.hide();
            itemView.find(".title").text("");
            itemView.find(".price").text("");
            itemView.find("img").attr("style", "");
            itemView.attr("data-sid", "");
        });

    var productsCache = {};
    var cursor = null;
    var initialized = false;
    var searchResult = [];
    window.searchResult = searchResult;

    function search(keyword) {
        var deferred;
        keyword = keyword || ''
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
            var url = "/merchant/promote/store_updates/search-items.json?keyword=" + keyword;
            if (cursor) {
                url += ("&cursor=" + (cursor || ""))
            }
            deferred = $.get(
                contextify(url)
            );
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

    var lastKeyword = '';
    $(".popup.add_collection_item")
        .on("keyup", ".search input", debounceUntilTimeout(function() {
            var keyword = $('.popup.add_collection_item .search input').val().trim();
            if (keyword !== lastKeyword) {
                cursor = null;
                emptyList();
            }
            search(keyword);
        }, 500, null))
        .on("click", ".products li", function() {
            $(".products li.selected").removeClass("selected");
            var $el = $(this);
            $el.addClass("selected");
        })
        .on("click", ".btn-add", function() {
            var $el = $(".add_collection_item .products li.selected");
            if ($el[0]) {
                this.disabled = true;
                var sid = $el.attr("id");
                var product = productsCache[sid];
                var itemView = $(".store_updates .add .item");
                itemView.find(".title").text(product.title);
                itemView.find(".price").text("$" + product.price);
                itemView.find("img").attr("style", "background-image:url(" + product.image + ")");
                itemView.attr("data-sid", sid);
                selectedProduct = product;

                itemView.show();
                this.disabled = false;
                closeItemPopup();
            }
        })
        .on("click", ".popup-close", function() {
            closeItemPopup();
        })
        .on("click", ".btn-cancel", function() {
            closeItemPopup();
        })
        .find('.products')
            .on("scroll", _.throttle(function() {
                if (cursor === '!') {
                    return;
                }
                var $el = $(this);
                console.log(
                    $el.prop("scrollHeight"), $el.prop("clientHeight"), $el.prop("scrollTop"),
                    ($el.prop("scrollHeight") - $el.prop("clientHeight") - $el.prop("scrollTop")) < 60
                );
                if (!$loader.is(":visible") &&
                    ($el.prop("scrollHeight") - $el.prop("clientHeight") - $el.prop("scrollTop")) < 60
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
            }, 100));

    function closeItemPopup() {
        $.dialog("add_collection_item").close();
        if (isPopupView) {
            setTimeout(function() {
                $.dialog("store_updates").open();
            }, 400);
        }
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
            emptyList()
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
            deferred = $.get(contextify("/merchant/promote/store_updates/search-items.json"));
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
});
