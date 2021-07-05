jQuery(function($) {
    $(document).delegate('.actions > .like', 'click', function(event) {
        $button = $(event.target)
        sale_item_id = $button.data('sale-item-id')

        if(!sale_item_id) return
        if($button.hasClass('login-required')) {
            return
        }

        if($button.attr('waiting')) return
        $button.attr('waiting',true)

        var url = '/add_fancy.json'
        if($button.hasClass('on')) {
            url = '/remove_fancy.json'
        }
        $button.toggleClass('on')
        var count = parseInt($button.text());
        if(!isNaN(count)){
            $button.data('prev-liked', count);
            if($button.hasClass('on')){
                $button.text( count+1 ); 
            }else{
                $button.text( Math.max(0,count-1) );
            }
        }
        if( !isNaN( parseInt($button.data("fancyd-count"))) ){
            var fancydCount = parseInt($button.data("fancyd-count")), $fancydList = $button.next();
            if($button.hasClass('on')){
                fancydCount++;
                $fancydList
                    .find(".me").show().end()
                    .find(".other").hide().end()
                if(fancydCount>1){
                    var txt = '+'+(fancydCount-1)+" others";
                    if(fancydCount-1 == 1) txt = '+'+(fancydCount-1)+" other";
                    $fancydList
                        .find(".other_count").show().text(txt);
                }
            }else{
                fancydCount--;
                $fancydList
                    .find(".me").hide().end()
                    .find(".other").show().end()
                
                var txt = '+'+(fancydCount-1)+" others";
                if(fancydCount-1 == 1) txt = '+'+(fancydCount-1)+" other";

                if(fancydCount>1){
                    $fancydList
                        .find(".other_count").show().text(txt);
                }else{
                    $fancydList
                        .find(".other_count").hide().text(txt);
                }
            }
            var txt = "Liked by "+fancydCount+" people";
            if(fancydCount == 1) txt = "Liked by "+fancydCount+" person";
            $fancydList.find("b.tit").text(txt);
            $button.data("fancyd-count", fancydCount);
        }

        $.post(url, {'sale-item-id': sale_item_id}, function(res) {
            if(res.status) {
                if(!isNaN(count) && !isNaN(res.fancy_count)) {
                    $button.text(res.fancy_count);
                }
                if(res.fancyd_by_me) {
                    $button.addClass('on')
                    $button.trigger('liked', true)
                } else {
                    $button.removeClass('on')
                    $button.trigger('liked', false)
                }
            } else {
                $button.toggleClass('on')
                $button.data('prev-liked') && $button.text($button.data('prev-liked'));
            }
        }).fail(function(xhr) {
            $button.toggleClass('on');
            $button.data('prev-liked') && $button.text($button.data('prev-liked'));
        }).always(function() {
            $button.removeAttr('waiting')
        })
    })

    $(document).delegate('.actions > .add', 'click', function(event) {
        $button = $(event.target)
        sale_item_id = $button.data('sale-item-id')

        if(!sale_item_id) return

        if($button.hasClass('login-required')) {
            return
        }

        var url = '/add_wishlist.json'
        if($button.hasClass('on')) {
            url = '/remove_wishlist.json'
        }
        $button.toggleClass('on')
        $.post(url, {'sale-item-id': sale_item_id}, function(res) {
            if(res.status) {
                if(res.wished_by_me) {
                    $button.addClass('on')
                    $button.trigger('wished', true)
                } else {
                    $button.removeClass('on')
                    $button.trigger('wished', false)
                }
            } else {
                $button.toggleClass('on')
            }
        }).fail(function(xhr) {
            $button.toggleClass('on')
        })
    })

    $(document.body)
        .on('click', '.actions.in-card .share', function(){
            var $showShare = $('.itemListElement.show_share');
            if ($showShare.length > 0) {
                $showShare.removeClass('show_share');
                setTimeout(function(){
                    $showShare.find('.actions.opened').removeClass('opened');
                }, 400)
            }

            $(this)
                .closest('.itemListElement').addClass('show_share').end()
                .closest('.actions').addClass('opened');
            return false;
        })
        .on('click', '.actions.in-card .close', function(){
            var ttime = 0;
            var showShareOpen = $(this).closest('.itemListElement').is('.show_share')
            if (showShareOpen) {
                $(this).closest('.itemListElement').removeClass('show_share')
                ttime = 400
            }

            setTimeout(function(){
                $('.itemListElement .actions').removeClass('opened');
            }, ttime)
            return false;
        })
        .on('mousedown', '.actions.in-card .share_link', function(event) {        
            event.preventDefault();
            var $link = $(this);
            Gear.prepareClipboard(location.protocol + '//' + location.hostname + $link.attr('href')); // see common.js
        })
        .on('mouseup', '.actions.in-card .share_link', function(event) {        
            event.preventDefault();
            Gear.copyToClipboard(); // see common.js
        })
        .on('click', '.actions.in-card .share_link', function(event) {
            event.preventDefault();
            var $link = $(this);
            var originalLabel = $link.text();
            if( $link.find("em").length ){
                $link.find("em").text('Link Copied');
            }else{
                $link.text('Link Copied');    
            }
            
            // restore label
            setTimeout(function(){
                if( $link.find("em").length ){
                    $link.find("em").text(originalLabel);
                }else{
                    $link.text(originalLabel);    
                }
            }, 5000)
        })
        .on('click', '.add-cart > a.add, .add-cart > .sales_popup a.add', function(event){
            event.preventDefault();
            var $this = $(this);
            if($this.hasClass('soldout')) return;
            $(".add-cart .sales_popup").hide();

            if($this.prev().is(".sales_popup")){
                $this.prev().show();
                return;
            }

            var sale_item_id = $(this).data('sale-item-id')
            var seller_id = $(this).data('seller-id')
            var option_id = $this.prevAll(".option").length && $this.prevAll(".option").find("select").val() || null;
            var price = $(this).data('sale-item-price') || 0;
            var quantity = 1

            if( !option_id && $this.prev(".option").find("select option:selected")[0] ){
                alertify.alert('Please select an option.');
                return;
            }

            if( option_id && $this.prev(".option").find("select option:selected").attr('soldout') == 'True' ){
                alertify.alert('Selected option is soldout. please select another option.');
                return;
            }

            $this.prop('disabled', true);
            if($this.hasClass('loading')) {
                return
            }
            $this.prop('disabled',true)
            $this.addClass('loading')

            $.post('/add_item_to_cart.json', {'sale_item_id':sale_item_id, 'seller_id':seller_id, 'option_id': option_id, 'quantity': quantity}, function(res) {
                if(res.status_code>0) {
                    try { fbq('track', 'AddToCart', {content_type:'product', content_ids:[sale_item_id], value:price, currency:'USD'}); } catch (e) {}
                    window.location = '/cart'
                }else{
                    $this.prop('disabled', false);
                    $this.removeClass('loading');
                    res.message && alertify.alert(res.message);
                }
            }).fail(function(xhr) {
                if(xhr.status){
                    alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                }
                $this.prop('disabled', false);
                $this.removeClass('loading')
            }).always(function() {
                
            })
        })
        .on('click', '.add-cart > .option a.close', function(event){
            event.preventDefault();
            var $this = $(this);
            var $btnCart = $this.closest('.add-cart').find('a.add');
            $this.closest('.option').removeClass('show');
            $btnCart.removeClass('soldout').html('Add to Cart');
        })
        .on('change', '.add-cart > .option select', function(event){
            event.preventDefault();
            var $this = $(this);
            var soldout = $this.find("option:selected").attr('soldout');
            var $btnCart = $this.closest('.add-cart').find('a.add');
            if(soldout == 'True'){
                $btnCart.addClass('soldout').html('Soldout');
            }else{
                $btnCart.removeClass('soldout').html('Add to Cart');
            }
        })
        .on('click', '.notifyme', function(event){
            event.preventDefault();
            var $this = $(this);
            var email = $(this).data('email');
            var sale_item_id = $(this).data('sale_id');
            var option_id = $(this).data('option_id');
            var remove = $(this).hasClass('remove');

            if(remove){
                $.get('/wait_for_product.json', {email:email, sale_item_id:sale_item_id, option_id:option_id, remove:remove?1:0 }, function(res){
                    $this.closest('.out, .btn-cart')
                        .find('a').removeClass('remove').html( '<b>Notify me</b> <em>Click to be notified when this item is back in stock.</em>')
                    if(option_id) $("select[name=option_id] option[value="+option_id+"]").attr('waiting', 'False');
                })
            }else{
                if(logged_in){
                    $.get('/wait_for_product.json', {sale_item_id:sale_item_id, option_id:option_id}, function(res){
                        $this.closest('.out, .btn-cart')
                            .find('a').addClass('remove').html( '<b>Subscribed</b> <em>Click to cancel your stock notification.</em>')

                        if(option_id) $("select[name=option_id] option[value="+option_id+"]").attr('waiting', 'True');
                    })
                }else{
                    $.dialog('stock-notify').$obj.data('button', $(this));
                    $.dialog('stock-notify').open();
                }
                
            }
        })

    var dlgStockNotify = $.dialog('stock-notify');
    dlgStockNotify.$obj
        .on('click', 'button', function(){
            var $btn=dlgStockNotify.$obj.data('button'),
                personalized = dlgStockNotify.$obj.find('input:checkbox').prop('checked'), 
                email = dlgStockNotify.$obj.find('input:text').val(), 
                sale_item_id=$btn.data('sale_id'),
                option_id=$btn.data('option_id');

            if(!dlgStockNotify.$obj.find('input:text').is(":visible") && email){
                alertify.alert('Please enter your email address');
                return;
            }

            $.get('/wait_for_product.json', {email:email, sale_item_id:sale_item_id, option_id:option_id, personalized:personalized}, function(res){
                $btn.closest('.out, .btn-cart')
                    .find('a').addClass('remove').html( '<b>Subscribed</b> <em>Click to cancel your stock notification.</em>')

                if(option_id) $("select[name=option_id] option[value="+option_id+"]").attr('waiting', 'True');

                dlgStockNotify.close();
                if(email) $btn.data('email', email);
            })
            
        })

})
