var Fancy = window.Fancy || {};

Fancy.CoverImage = function(params){
        console.log("CoverImage2 init.");
        
        // required element
        this.$fileInput = $(params.input);
        
        // optional element
        this.$loader = params.loader && $(params.loader);
        this.$image = params.image && $(params.image);
        this.$uploadBtn = params.button && $(params.button);
        this.$dropZone = params.dropZone && $(params.dropZone);

        // optional info
        this.objectType = params.objectType;
        this.objectId = params.objectId;
        this.appLabel = params.appLabel||"fancy";
        this.maxWidth = params.maxWidth||1200;
        this.resize = params.resize||false;
        this.resizeMethod = params.resizeMethod||'crop';
        this.uploadUrl = params.url||'/upload_cover_image.json';
        this.previewAsBackground = params.previewAsBackground||false;
        this.autoupload = params.autoupload||false;
        this.autoupdate = params.autoupdate||false;
        
        // events
        this.beforeUpload = params.beforeUpload;
        this.complete = params.complete;
        this.success = params.success;
        this.error = params.error;
        this.progress = params.progress;
        
        this.uploaded = false;
        this.image = null;
        this.alert = alertify && alertify.alert || alert;

        this.initEvent();
}

Fancy.CoverImage.prototype = {
    initEvent: function() {
        var that = this;
        this.$uploadBtn && this.$uploadBtn.on('click', function(e) {
            if(e.target!==that.$fileInput[0]){
                that.$fileInput.click();
            }
        });
        this.autoupload && this.$fileInput.on('change', function() {
            that.upload();
        });

        this.$dropZone && this.$dropZone.on('drop', function(e){
            e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            var dataTransfer = e.dataTransfer;
            if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
                e.preventDefault();
                that.$fileInput[0].files = dataTransfer.files;
            }
        });
    },
    upload: function() {
        console.log('upload start');
        var that = this;
        var file_form = this.$fileInput[0];
        var progress_id, file, filename, extension, filelist;

        filelist = file_form.files || (file_form.value ? [{name:file_form.value}] : []);
        if(filelist && filelist.length) file = filelist[0];

        if(!file){
            this.alert(gettext('Please select a file to upload'));
            return false;
        }

        if(!/([^\\\/]+\.(jpe?g|png|gif))$/i.test(file.name||file.filename)){
            this.alert(gettext('The image must be in one of the following formats: .jpeg, .jpg, .gif or .png.'));
            return false;
        }

        if (file.size >= 5 * 1024 * 1024) {
            this.alert(gettext('Maximum file size is 5MB.'));
            return false;
        }

        filename  = RegExp.$1;
        extension = RegExp.$2;

        this._uploadBegin();

        if(!window.FileReader || !window.XMLHttpRequest) {
            this.null_counter = 0;
            this.completed = false;

            progress_id = parseInt(Math.random()*10000);
            document.cookie = 'X-Progress-ID='+progress_id+'; path=/';
            window._upload_image_callback = function(json){
                that.completed = true;
                that._uploadComplete(json); 
            };

            setTimeout(function() {
                that.get_progress(progress_id);
            }, 300);
            return true;
        }

        this.xhr = new XMLHttpRequest();
        var self = this;
        this.xhr.upload.addEventListener('progress', function(e){ that._onprogress(e.loaded, e.total)}, false);
        this.xhr.onreadystatechange = function(e) {
            if(self.xhr.readyState !== 4) return;

            if(self.xhr.status === 200) {
                // success
                var data = self.xhr.responseText;
                var json;
                try {
                    if(window.JSON) json = window.JSON.parse(data);
                } catch(e){
                    try { json = new Function('return '+data)(); } catch(ee) { json = null }
                }

                that._uploadComplete(json);
            }else if(self.xhr.status > 0){
                that.alert("Upload Failed! Please try again.");
                that.error && that.error();
            }
        };

        var url = this.uploadUrl+'?for='+this.appLabel+'_'+this.objectType+'&max_width='+this.maxWidth+'&filename=' + filename;
        if( this.autoupdate && this.objectType && this.objectId){
            url += '&app_label='+this.appLabel+'&object_type=' + this.objectType + '&object_id=' + this.objectId + (this.resize?('&resize='+this.resize+'&method='+this.resizeMethod):'')
        }

        this.xhr.open('POST', url, true);
        this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.xhr.setRequestHeader('X-Filename', encodeURIComponent(filename));
        this.xhr.send(file);
    },
    abort: function(){
        try{ this.xhr.abort() }catch(e){}
        try{ this.xhrByUrl.abort() }catch(e){}
    },
    _uploadBegin: function() {
        console.log('upload begin.');
        this.$loader && this.$loader.show();
        this.beforeUpload && this.beforeUpload();
    },
    _uploadComplete: function(json) {
        console.log('upload completed.');
        if (json.status_code !== undefined && json.status_code == 1) {
            var image_url = "/temp_uploaded_cover_image.jpg?" + Math.random();
            if (json.image && json.image.url) {
                image_url = json.image.url;
            } else if (json.image_url) {
                image_url = json.image_url;
            }
            this._showPreview(image_url, true);
            this.uploaded = true;
            this.success && this.success({url:image_url});
        } else if (json.status_code !== undefined && json.status_code == 0) {
            json.message && this.alert(json.message);
            this.error && this.error();
        }
        this.$loader && this.$loader.hide();
        this.complete && this.complete();
    },
    _onprogress: function(cur, len) {
        var prog = Math.max(Math.min(cur/len*100,100),0).toFixed(1);
        this.progress && this.progress(prog);
    },
    getProgress: function(progressId) {
        var that = this;
        $.ajax({
            type : 'get',
            url  : '/get_upload_progress.json',
            data : {'X-Progress-ID': progress_id},
            dataType : 'json',
            success  : function(json){
                if(!json) return;
                if(json.uploaded + 1000 >= json.length) json.uploaded = json.length;
                that._onprogress(json.uploaded, json.length);
            },
            complete : function(xhr){
                if(that.completed || that.null_counter > 10) return;
                if(xhr.responseText == 'null') that.null_counter++;
                setTimeout(that.get_progress, 500);
            }
        });
    },
    _showPreview: function(coverImgUrl, isTempImg) {
        if(this.$image){
            if(this.previewAsBackground){
                this.$image.css('backgroundImage','url("'+coverImgUrl+'")');
            }else{
                this.$image.attr('src', coverImgUrl);
            }
            this.$image.show();
        }
        if (isTempImg) {
            this.tempCoverImg = coverImgUrl;
        }
    },
    hasUploadedImage: function() {
        return this.uploaded;
    },
    uploadByUrl: function(url, identity){
        var that = this;
        url = url.trim();
        if(!url.length) {
            this.alert(gettext('Please enter a image url.'));
            return false;
        }
        if (!/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)) {
            this.alert(gettext('Please enter a valid image url.'));
            return false;
        }
        this._uploadBegin();

        var uploadFor = '';
        if (identity === 'seller') {
            uploadFor += '&for=fancy_saleitemseller';
        } else if (identity === 'user') {
            uploadFor += '&for=fancy_userprofile';
        }
        
        var uploadUrl = '/upload_cover_image.json?max_width=1940&url=' + url + uploadFor;
        if( this.autoupdate && this.objectType && this.objectId){
            uploadUrl += '&update_cover=true&app_label='+this.appLabel+'&object_type=' + this.objectType + '&object_id=' + this.objectId + (this.resize?('&resize='+this.resize+'&method='+this.resizeMethod):'')
        }

        this.xhrByUrl = $.post(uploadUrl, {}, function(json){
            that._uploadComplete(json);
        } )
    },
    save: function(callback) {
        var that = this;
        if(!this.objectType || !this.objectId){
            console.log('objectType and objectId is required');
            return;
        }
        $.get(
            '/update_cover_image.json?for='+this.appLabel+'_'+this.objectType+'&app_label='+this.appLabel+'&object_type=' + this.objectType + '&object_id=' + this.objectId + (this.resize?('&resize='+this.resize+'&method='+this.resizeMethod):''),
            function(json){
                if (json.status_code !== undefined && json.status_code == 1) {
                    callback && callback(json);
                } else if (json.status_code !== undefined && json.status_code === 0) {
                    json.message && that.alert(json.message);
                }
            },
            "json"
        );
    },
    delete: function(callback){
        var that = this;
        if(!this.objectType || !this.objectId){
            console.log('objectType and objectId is required');
            return;
        }
        $.post(
            '/delete_cover_image.json',
            {
                object_id: this.objectId,
                object_type: this.objectType,
                app_label : this.appLabel
            }, // parameters
            function(response){
                if (response.status_code != undefined && response.status_code == 1) {
                    callback && callback();
                }
                else if (response.status_code != undefined && response.status_code == 0) {
                    response.message && that.alert(response.message);
                }
            },
            "json"
        );
    }
};
