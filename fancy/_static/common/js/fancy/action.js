Fancy = Fancy || {};

Fancy.Action = {
    follow: function($el, url, params, successCallback) {
        this._doFollowing($el, url, params, successCallback);
    },
    unFollow: function($el, url, params, successCallback) {
        this._doFollowing($el, url, params, successCallback);
    },
    _doFollowing: function($el, url, params, successCallback) {
        $el.toggleClass('loading');
        $.ajax({
            type : 'post',
            url  : url,
            data : params,
            dataType : 'xml',
            success : function(xml){
                var $status = $(xml).find('status_code');
                if ($status.length && $status.text() !== 0) { // if status_code is 0, it means error.
                    $el.toggleClass('follow following');
                    if (successCallback) {
                        successCallback($el);
                    }
                }
            },
            complete : function(){
                $el.toggleClass('loading');
            }
        });
    },
    doFancy: function(tid, params, successCallback) {
        params['fancyd'] = true;
        $.ajax({
            type : 'PUT',
            url  : '/rest-api/v1/things/'+tid,
            data : params,
            success  : function(){
                if ($.isFunction(successCallback)) {
                    successCallback();
                }
            },
        });
    },
    unFancy: function(tid, successCallback) {
        $.ajax({
            type : 'PUT',
            url  : '/rest-api/v1/things/'+tid,
            data : {
                fancyd: false,
            },
            success  : function(){
                if ($.isFunction(successCallback)) {
                    successCallback();
                }
            },
        });
    }
};