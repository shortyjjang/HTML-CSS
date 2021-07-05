window.__thingSidebar = function (scope) {
var $scope;
if (scope) {
    $scope = $(scope);
} else {
    $scope = $(document.body);
}

$(document).ready(function() {
    $scope.find('#sidebar .from.thing-more')
        .on('click', '.following, .follow', function(e) {
            e.preventDefault();
            var $this = $(this), login_require = $this.attr('require_login') || $this.attr('data-require_login');
            if (typeof(login_require) != undefined && login_require === 'true')  return require_login();
            $this.addClass('loading');
            if($this.hasClass('follow')){
                try{track_event('Follow Store', {seller_id:$this.attr('sid')});}catch(e){}
            }else{
                try{track_event('Unfollow Store', {seller_id:$this.attr('sid')});}catch(e){}
            }
            $.ajax({
                type : 'post',
                url  : $this.hasClass('follow') ? '/add_follow.xml' : '/delete_follow.xml',
                data : {
                    seller_id: $this.attr('sid') || $this.attr('data-sid'),
                },
                dataType : 'xml',
                success : function(xml){
                    var $xml = $(xml), $status = $xml.find('status_code');
                    if ($status.length && $status.text() == 1) {
                        $this.toggleClass('follow following');
                        if ($this.hasClass('following')) {
                            $this.text('Following Store');
                        } else {
                            $this.text('Follow Store');
                        }
                    }
                },
                complete : function(){
                    $this.removeClass('loading');
                }
            });
        });
    
    $scope.find('#sidebar').delegate('.add_to_cart', 'click', function(event){
        event.preventDefault();
        var $this = $(this);
        if ($this.hasClass('soldout')) {
            return;
        }
        if ($this.attr('id') === 'fancy-g-link') {
            return true;
        }

        var param = {}, i, c, q, prefix;
        var login_require = $this.attr('require_login') || $this.attr('data-require_login'); 
        var is_fancybox = ($this.attr('stype') || $this.attr('data-stype')) === 'fancybox';

        param['seller_id'] = $this.attr('sisi') || $this.attr('data-sisi');
        param['thing_id'] = $this.attr('tid') || $this.attr('data-tid');
        param['quantity']  = 1;

        prefix = $this.attr('prefix') || $this.attr('data-prefix') || '';
        if(prefix) prefix += '-';

        if (is_fancybox) {
            var $frm = $this.parents(".frm");
            var has_categories = ($this.attr('has_categories') || $this.attr('data-has_categories')) === 'true';
            var allow_multiple = ($this.attr('allow_multiple') || $this.attr('data-allow_multiple')) === 'true';
            var categories = [];
            var note = $frm.find('textarea[id=note]').val();
            if (has_categories) {
                $frm.find('.fancybox-category input[name=categories]:checked').each(function(){categories.push($this.val())});
                if (categories.length != 3) {
                alert(gettext('Please choose three categories.'));
                return false;
                }
            }
            param['sale_item_id'] = $frm.find('select[name=sale_item_id]').val();
            param['categories'] = categories.join(',');
            param['is_fancybox'] = is_fancybox;
            param['allow_multiple'] = allow_multiple;
            if (note) {
                param['note'] = note.trim();
            }
        } else {
            // quantity
            q = parseInt($scope.find('#'+prefix+'quantity').val());
            if(isNaN(q) || q <= 0) return alert(gettext('Please select a valid quantity.'));
            param['quantity'] = q;

            // option
            if($scope.find('#'+prefix+'option_id').length) {
                param['option_id'] = $scope.find('#'+prefix+'option_id').val();
            }

            param['sale_item_id'] = $this.attr('sii') || $this.attr('data-sii');
        }
        
        var mixpanel_param = { 'sale id': param['sale_item_id'] };
        try{ 
            var via = $this.attr('via') || $this.attr('data-via');
            var section = $this.attr('section') || $this.attr('data-section');
            var utm = $this.attr('utm') || $this.attr('data-utm');

            if ('option_id' in param) mixpanel_param['option id'] = param['option_id'];
            if (via) mixpanel_param['via'] = via;
            if (section) mixpanel_param.section = section;
            if (utm) mixpanel_param.utm = utm;
        } catch(e) {};
        if (typeof(login_require) != undefined && login_require != null && login_require=='true'){ 
            param['mixpanel'] = mixpanel_param;
            $.jStorage.set('fancy_add_to_cart', param);  
            $.dialog('popup.sign.signup').open();
            return;
        }

        if($this.hasClass('loading')) return;
        $this.addClass('loading');

        param.from_sds_page = window.from_sds_page;
        try { track_event('Add to Cart', mixpanel_param); } catch(e) {};
        if (dataLayer) {
            dataLayer.push({'event': 'Add_to_Cart_Button', 'product_id': param['sale_item_id'], 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': param['option_id'] });
        }

        $.ajax({
            type : 'POST',
            url  : '/add_item_to_cart.json',
            data : param,
            success : function(json){
                if(!json || json.status_code == null) return;
                if(json.status_code === 1){
                    var args = {
                        'THING_ID':$this.attr('tid') || $this.attr('data-tid'),
                        'ITEMCODE':json.itemcode,
                        'THUMBNAIL_IMAGE_URL':json.image_url,
                        'ITEMNAME':json.itemname,
                        'QUANTITY':json.quantity,
                        'PRICE':json.price,
                        'OPTIONS':json.option,
                        'HTML_URL':json.html_url,
                        'CART_ID':json.cart_id
                    };
                    if( json.fancy_price) args['FANCY_PRICE'] = json.fancy_price;
                    if (is_fancybox) {
                        Fancy.Cart.addItem(args);
                        $('textarea#note').val('');
                        $('.fancybox-category input[name=categories]:checked').prop('checked',false);
                    } else {
                        Fancy.Cart.addItem(args);
                    }
                    if($.dialog('things-v3').showing()){
                        $.dialog('things-v3').close();
                    }
                    $this.closest("span.show_cart.opened").removeClass("opened").closest("li.active").removeClass("active");
                    if( $("#slideshow").is(":visible")){
                        $("#slideshow").find("p.alert-cart").find("b").text(json.itemname).end().slideDown(250);
                        setTimeout(function(){
                            $("#slideshow").find("p.alert-cart").slideUp(250);
                        },3000)
                    }else{
                        Fancy.Cart.openPopup(); 
                    }                   

                } else if(json.status_code == 0){
                    if(json.message) alert(json.message);
                }
            },
            complete : function(){
                $this.removeClass('loading');
            }
        });
    });

    $scope.find('#sidebar').delegate('.buy_now', 'click', function(event){
        event.preventDefault();
        var $this = $(this);
        if ($this.hasClass('soldout')) {
            return;
        }

        if($this.attr('require_login')) {
            $.dialog('popup.sign.signup').open();
            return;
        }

        var param = {}
        var prefix = $this.attr('prefix') || $this.attr('data-prefix') || '';
        if(prefix) prefix += '-';

        param['seller_id'] = $this.attr('sisi') || $this.attr('data-sisi');
        param['thing_id'] = $this.attr('tid') || $this.attr('data-tid');
        param['quantity']  = 1;

        // quantity
        var quantity = parseInt($scope.find('#'+prefix+'quantity').val());
        if(isNaN(quantity) || quantity <= 0) return alert(gettext('Please select a valid quantity.'));
        param['quantity'] = quantity;

        // option
        if($scope.find('#'+prefix+'option_id').length) {
            param['option_id'] = $scope.find('#'+prefix+'option_id').val();
        }

        param['sale_item_id'] = $this.attr('sii') || $this.attr('data-sii');

        if($this.hasClass('loading')) return;
        $this.addClass('loading');

        var mixpanel_param = { 'sale id': param['sale_item_id'] };
        try{ 
            var via = $this.attr('via') || $this.attr('data-via');
            var section = $this.attr('section') || $this.attr('data-section');
            var utm = $this.attr('utm') || $this.attr('data-utm');

            if ('option_id' in param) mixpanel_param['option id'] = param['option_id'];
            if (via) mixpanel_param['via'] = via;
            if (section) mixpanel_param.section = section;
            if (utm) mixpanel_param.utm = utm;
        } catch(e) {};

        try { track_event('Express Checkout Web', mixpanel_param); } catch(e) {};

        params = {
            'express':JSON.stringify(param)
        }

        $.ajax({
            type: 'POST',
            url:  '/rest-api/v1/checkout',
            data: params,
            success: function(json) {
                console.log('Checkout object',json);
                if (json.error) {
                    console.trace(json.error)
                } else {
                    location.href = "/checkout?express"
                }
            }
        }).fail(function(xhr,statusText,error) {
            alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
        });

    });

    // report this thing
    $scope.find('.report-link').click(function(event){
        var $this = $(this);

        event.preventDefault();
        if (($this.attr('require_login') || $this.attr('data-require_login')) === 'true') return require_login();

        if ($this.hasClass("reported")) {
            alertify.confirm(gettext('Cancel Report this?'), function (e) {
                if (e){
                    $.ajax({
                        type : 'post',
                        url  : '/cancel_report_thing.xml',
                        data : {tid : $this.attr('tid') || $this.attr('data-tid')},
                        dataType : 'xml',
                        success  : function(xml){
                            var $xml = $(xml), $st = $xml.find('status_code');
                            // to do something?
                            if ($st.length && $st.text() == 1) {
                                alertify.alert(gettext("Cancelled your report."));
                                $this.removeClass("reported").html(gettext("Report inappropriate"));
                            }
                        }
                    });
                }
            });
        } else {
            alertify.confirm(gettext('Report this as inappropriate or broken?'),function (e) {
                if(e){
                    $.ajax({
                        type : 'post',
                        url  : '/report_thing.xml',
                        data : {tid : $this.attr('tid') || $this.attr('data-tid')},
                        dataType : 'xml',
                        success  : function(xml){
                            var $xml = $(xml), $st = $xml.find('status_code');
                            // to do something?
                            if ($st.length && $st.text() == 1) {
                                alertify.alert(gettext("Reported. We'll look into it."));
                                $this.addClass("reported").html(gettext("Undo reporting"));
                            }
                        }
                    });
                }
            });
        }
        return false;
    });
});

}

jQuery(function () {
  if (window.is_thing_detail_page) {
    window.__thingSidebar();
  }
});
