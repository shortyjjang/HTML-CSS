// infiniteshow
jQuery(function($) {
    function after_page_loaded($items, restored) {
        $items.find(".video_player").videoPlayer({autoplay:true, muted:true});
        $items
            .on('click', ".buttons.btn-read, .buttons.btn-explore", function(event) {
                event.preventDefault()
                var url = $(this).data('url')
                if(url) {
                    location.href = url
                }
            })
            .on('click', '.btn-buy', function(event){
                event.preventDefault();
                var $this = $(this);
                
                var sale_item_id = $(this).data('sale-item-id')
                var seller_id = $(this).data('seller-id')
                var option_id = $this.prev(".option").length && $this.prev(".option").find("select").val() || null;
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
                        $this.removeClass('loading')
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
            .on('click', '.frm > .option a.close', function(event){
                event.preventDefault();
                var $this = $(this);
                var $btnCart = $this.closest('.frm').find('.btn-buy');
                $this.closest('.option').removeClass('show');
                $btnCart.removeClass('soldout').html('Add to Cart');
            })
            .on('change', '.frm > .option select', function(event){
                event.preventDefault();
                var $this = $(this);
                var soldout = $this.find("option:selected").attr('soldout');
                var price = $this.find("option:selected").data('price');
                var retail_price = $this.find("option:selected").data('retail-price');
                var $btnCart = $this.closest('.frm').find('.btn-buy');
                if(soldout == 'True'){
                    $btnCart.addClass('soldout').html('Sold out');
                }else{
                    $btnCart.removeClass('soldout').html('Add to Cart');
                }
                if(price){
                    var $price = $("<b>$"+price+"</b>");
                    if( retail_price && parseFloat(retail_price) > parseFloat(price) ){
                        $price.addClass('sales').append(" <small class='before'>$"+retail_price+"</small>");
                    }
                    $this.closest(".figure-info").find("p.price").empty().append($price);
                }
            })
    }

	$.infiniteshow({
        itemSelector:'#content .popular > div,#content .popular > h3',
        streamSelector:'#content .popular',
        loaderSelector:'#infscr-loading-dummy',
        dataKey:'gear-featured',
        post_callback: function($items, restored){ 
          after_page_loaded($items, restored)
        },
        prefetch:true,
        autoload:false,
        changeurl:false,
    })

    after_page_loaded($('#content .popular > div,#content .popular > h3, .collections .figure-product'));
})

