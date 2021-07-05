FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.CreateCollectionPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: FancyBackbone.Utils.loadTemplate('popup_create_collection'),
    events: {
        'click .cover-preview .no': 'onAddPhotoClick',
        'change #add-cover-photo': 'onChangeImageFile',
        'click button.btn-fetch:not(.disabled)': 'onFetchImageFile',
        'click button.btn-create:not(.disabled)': 'onCreateCollection',
        'click button.btn-delete:not(.disabled)': 'onDeleteCollection',
        'click .cover-preview .btn-del': 'onDeletePhoto',
        'click .cover-preview .btn-move': 'onMovePhoto',
        'mousedown img#coverImg': 'onStartMoveImage',
        'mousemove img#coverImg': 'onDragImage',
        'mouseup img#coverImg': 'onStopMoveImage',
    },
    initialize: function() {
        this.dragging = false;
        this.moving = false;
    },
    onAddPhotoClick: function(e) {
        e.preventDefault();
        this.$el.find("#add-cover-photo").click();
    },
    onChangeImageFile: function(e) {
        var image_file = $(e.currentTarget).get(0).files[0];
        if (image_file === undefined) return;

        if(!/([^\\\/]+\.(jpe?g|png|gif))$/i.test(image_file.name)){
            alert(gettext('The image must be in one of the following formats: .jpeg, .jpg, .gif or .png.'));
            return false;
        }

        var filename = image_file.name.split('.')[0];

        this._beginUpload();
        if(!window.FileReader || !window.XMLHttpRequest) {
            this.null_counter = 0;
            this.completed = false;

            this.progress_id = parseInt(Math.random()*10000, 10);
            document.cookie = 'X-Progress-ID='+this.progress_id+'; path=/';
            window._upload_image_callback = function(json){ this.completed = true; this._uploadComplete(json); };

            setTimeout(this._getProgress, 300);
            return true;
        }

        var xhr = this._getRequestObj();
        xhr.open('POST', '/upload_cover_image.json?max_width=1940&filename=' + filename, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('X-Filename', encodeURIComponent(filename));
        xhr.send(image_file);
    },
    onFetchImageFile: function(e) {
        var url = this.$el.find("#uploadcoverUrl").val().trim();
        if(!url.length) {
            alert(gettext('Please enter a image url.'));
            return false;
        }
        if (!/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)) {
            alert(gettext('Please enter a valid image url.'));
            return false;
        }

        this._beginUpload();
        var xhr = this._getRequestObj();
        xhr.open('POST', '/upload_cover_image.json?max_width=1940&url=' + url, true);
        xhr.send();
    },
    onCreateCollection: function(e) {
        var name = this.$el.find('.list-title').val();
        var description = this.$el.find('.list-desc').val();

        if (!this._isValid(name)) {
            alert('Please enter the valid name.');
            return;
        }

        var that = this;
        var data = { 'title': name, 'description': description, 'collection_id': that.collectionId, 'seller_id' : window.seller.id };
        if (that.collectionId) {
            var slug = this.$el.find('.list-slug').val();
            if (!/^[\w-_]+$/.exec(slug)) {
                alert('Slug can only contain numbers, letters, underscores, and hyphen.');
                return;
            }
            data['slug'] = slug;
        }

        this.$el.find('.btn-create').addClass('disabled');
        $.post(
            "/merchant/products/collections/" + (that.collectionId === undefined ? 'create.json' : 'update.json'), data,
            function(json){
                if (json.status_code == 1) {
                    var collectionId = json.collection_id;
                    if (that.tempCoverImg) {
                        that._saveImageToServer(collectionId);
                    } else {
                        if (that.model && that.model.attributes) {
                            var attr = that.model.attributes[0];
                            if (attr.image && attr.image.offset_y != parseInt(that.$el.find('img#coverImg').css('margin-top'), 10)) {
                                that._saveImagePosition(collectionId);
                            } else {
                                that._createCompleted();
                            }
                        } else {
                            that._createCompleted();
                        }
                    }
                }
                else {
                    var msg = json.message;
                    if (msg && msg !== '') {
                        alert(msg);
                    }
                }
            }, "json");
    },
    onDeleteCollection: function(e) {
        e.preventDefault();
        if (window.confirm('Are you sure?')){
            this.$el.find('.btn-delete').addClass('disabled');
            var that = this;
            $.post(
                "/merchant/products/collections/delete.json",
                { 'collection_id': that.collectionId,  'seller_id' : window.seller.id},
                function(json){
                    if (json.status_code == 1) {
                        that.$el.find('.btn-delete').removeClass('disabled');
                        that.trigger('saved');
                        that.close();
                    }
                    else {
                        var msg = json.message;
                        if (msg && msg !== '') {
                            alert(msg);
                        }
                    }
                });
        }
    },
    onDeletePhoto: function(e) {
        e.preventDefault();
        if (window.confirm('Are you sure?')){
            this.tempCoverImg = null;
            this.$el.find('img#coverImg').attr('src', '');
            this.$el.find('img#coverImg').hide();
            this._hideCoverImgButtons();
            if (this.collectionId) {
                this._deleteImage(this.collectionId);
            }
        }
    },
    onMovePhoto: function(e) {
        this._hideCoverImgButtons();
        this.$el.find('.cover-preview .guide').show();
        this.moving = true;
    },
    onStartMoveImage: function(e) {
        if (!this.moving) return;
        this.$el.find('.cover-preview .guide').hide();
        var $coverImg = this.$el.find('img#coverImg');
        var $parent = $coverImg.parent();
        if (e.which !== 1 || $parent.hasClass('moving')) return;
        $parent.addClass('moving');
        e.preventDefault();

        
        this.imgDrag = {
            startY: e.pageY,
            limit: - ($coverImg.height() - $parent.height()),
            orgY: parseInt($coverImg.css('margin-top'), 10),
        };
        this.dragging = true;
    },
    onDragImage: function(e) {
        if (!this.dragging) return;
        var y = e.pageY - this.imgDrag.startY + this.imgDrag.orgY;
        if (y > 0) y = 0;
        else if (y < this.imgDrag.limit) y = this.imgDrag.limit;
        this.$el.find('img#coverImg').css('margin-top', y + 'px');
    },
    onStopMoveImage: function(e) {
        this.dragging = false;
        this.moving = false;
        this.$el.find('img#coverImg').parent().removeClass('moving');
        this._showCoverImgButtons();
    },
    _beginUpload: function() {
        this.$el.find(".cover-preview .infscr-loading").show();
        this.$el.find(".cover-preview .loading").css('width','1%');
        this.$el.find('.btn-fetch').addClass('disabled');
        this._hideCoverImgButtons();
    },
    _onProgress: function(cur, length) {
        var prog = Math.max(Math.min(cur/length*90,90),0).toFixed(1);
        this.$el.find(".cover-preview .loading").css('width', prog +'%');
    },
    _getProgress: function() {
        var that = this;
        $.ajax({
            type : 'get',
            url  : '/get_upload_progress.json',
            data : {'X-Progress-ID': that.progress_id},
            dataType : 'json',
            success  : function(json){
                if(!json) return;
                if(json.uploaded + 1000 >= json.length) json.uploaded = json.length;
                that._onProgress(json.uploaded, json.length);
            },
            complete : function(xhr){
                if(that.completed || that.null_counter > 10) return;
                if(xhr.responseText == 'null') that.null_counter++;
                setTimeout(that._getProgress, 500);
            }
        });
    },
    _getRequestObj: function(filename, image_file) {
        var that = this;
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(e){ that._onProgress(e.loaded, e.total);}, false);
        xhr.onreadystatechange = function(e){
            if(xhr.readyState !== 4) return;
            if(xhr.status === 200){
                // success
                var data = xhr.responseText, json;
                try {
                    if(window.JSON)
                        json = window.JSON.parse(data);
                } catch(e) {
                    try { json = new Function('return '+data)(); } catch(ee){ json = null };
                }
                that.$el.find(".cover-preview .loading").css('width','90%');
                that._uploadCompleted(json);
            }
        };

        return xhr;
    },
    _uploadCompleted: function(json) {
        if (json.status_code !== undefined && json.status_code == 1) {
            this._showCoverImage("/temp_uploaded_cover_image.jpg?" + Math.random(), true);
        } else if (json.status_code !== undefined && json.status_code === 0) {
            if (json.message !== undefined)
                alert(json.message);
            this._reset();
        }
        this.$el.find('.btn-fetch').removeClass('disabled');
        this.$el.find(".cover-preview .infscr-loading").hide();
    },
    _saveImageToServer: function(obj_id) {
        var that = this;
        $.get(
            '/update_cover_image.json?object_type=shopcollection&object_id=' + obj_id,
            function(json){
                if (json.status_code !== undefined && json.status_code == 1) {
                    that._saveImagePosition(obj_id);
                } else if (json.status_code !== undefined && json.status_code === 0) {
                    if(json.message !== undefined)
                        alert(json.message);
                }
            },
            "json"
        );
    },
    _saveImagePosition: function(obj_id) {
        var that = this;
        $.get(
            '/reposition_cover_image.json?object_type=shopcollection&object_id=' + obj_id + '&offset_y=' + parseInt(this.$el.find('img#coverImg').css('margin-top'), 10),
            function(json){
                if (json.status_code !== undefined && json.status_code == 1) {
                    that._createCompleted();
                }
                else if (json.status_code !== undefined && json.status_code === 0) {
                    if(json.message !== undefined)
                        alert(json.message);
                }
            },
            "json"
        );
    },
    _deleteImage: function(obj_id) {
        var that = this;
        $.post(
            '/delete_cover_image.json',
            {
                object_type: 'shopcollection',
                object_id: obj_id,
            },
            function(json){
                if (json.status_code == 1) {
                    that.trigger('saved');
                } else if (json.status_code !== undefined && json.status_code === 0) {
                    if(json.message !== undefined)
                        alert(json.message);
                }
            },
            "json"
        );
    },
    _createCompleted: function() {
        this.$el.find('.btn-create').removeClass('disabled');
        this.trigger('saved');
        this.close();
    },
    _showCoverImgButtons: function() {
        this.$el.find('.cover-preview .btn-del').show();
        this.$el.find('.cover-preview .btn-move').show();
    },
    _hideCoverImgButtons: function() {
        this.$el.find('.cover-preview .btn-del').hide();
        this.$el.find('.cover-preview .btn-move').hide();
    },
    _showCoverImage: function(coverImgUrl, isTempImg) {
        this.$el.find('img#coverImg').attr('src', coverImgUrl);
        this.$el.find('img#coverImg').show();
        if (isTempImg) {
            this.tempCoverImg = coverImgUrl;
        }
        this.$el.find('img#coverImage').on('load', _.bind(this._showCoverImgButtons, this));
    },
    _isValid: function(string) {
        if (string === undefined || string === null || string === '')
            return false;
        return true;
    },
    open: function () {
        this.tempCoverImg = null;
        $.dialog("new_collection").open();
    },
    close: function() {
        $.dialog("new_collection").close();
    },
    render: function(collectionId) {
        this.collectionId = collectionId;
        this.$el.html(this.template({
            title: collectionId === undefined ? 'Create New Collection' : 'Edit Collection',
            button: collectionId === undefined ? 'Create' : 'Save',
            isEdit: collectionId === undefined ? false : true,
            collectionId: collectionId,
        }));
        this.open();

        if (collectionId > 0) {
            this.model = new FancyBackbone.Models.Collection.Collection({
                seller: window.seller.id,
                collection: collectionId
            });
            var that = this;
            this.model.fetch().success(function() {
                that._renderContent();
            });
        } else {
            this.model = null;
        }
        return this;
    },
    _renderContent: function() {
        var attrs = this.model.attributes[0];
        this.$el.find('.list-title').val(attrs.name);
        this.$el.find('.list-desc').val(attrs.description);
        this.$el.find('.list-slug').val(attrs.slug);
        if (attrs.image) {
            this._showCoverImage(attrs.image.resized_url, false);
            this.$el.find('#coverImg').css('margin-top', attrs.image.offset_y);
        }

    }
});
