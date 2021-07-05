jQuery(function($){
    $('.customer_info .customer_name .text').on('keydown', function(e) {
        if (e.keyCode === 13) { // ENTER
            var username = $(this).val();
            renderUserCart(username);
        }
    });

    $('.customer_info .add-to-order').on('click', function(e) {
        var $order = $(this).closest('.add_order');
        var saleItemId = $order.find('.item_id .text').val();
        var optionId = $order.find('.opt_id .text').val();
        var quantity = $order.find('.qty .text').val();

        if (isValidOrder(saleItemId, optionId, quantity)) {
            var username = $('.add_items').attr('user');
            $.post('/rest-api/v1/users/' + username + '/carts/saleitem', {
                    sale_item_id: saleItemId,
                    option_id: optionId,
                    quantity: quantity,
                },function(response) {
                    console.log(response);
                    renderUserCart(username);
            }).fail(function(response) {
                console.log(response);
                alert("Invalid Request.");
            });
        }
    });

    $('.customer_info .submit button').on('click', function(e) {
        var params = {
            "payment_gateway": 6,
            "username": $('.add_items').attr('user'),
            "v3": true
        };

        $.post('/rest-api/v1/checkout', params, function(res){
                document.location.href= "/checkout?" + $.param(params);
            }
        );
    });

    $('.customer_info .add_items .added_order').on('click', '.remove', function(e) {
        e.preventDefault();
        console.log("click remove buttom");
        var $listItem = $(e.currentTarget).closest('li');
        var data = {
            cart_id: $('.add_items').attr('cart-id'),
            sale_item_cart_id: $listItem.attr('cart-item-id'),
            is_fancybox: false,
            user : $('.add_items').attr('user')
        };

        console.log(data);

        $.ajax({
            type : 'POST',
            url  : '/remove_cart_item.json',
            data : data,
            dataType : 'json',
            success  : function(resp) {
                renderUserCart($('.add_items').attr('user'));
            }
        });
    });

    function renderUserCart(username) {
        $.get('/rest-api/v1/users/' + username + '/carts/saleitem', function(response) {
            console.log(response);
            renderSaleItems(response.items);
            renderCartSummary(response);

            $('.add_items').show();
            $('.submit').show();

            $('.add_items').attr('user', username);
            $('.add_items').attr('uid', response.customer_id);
            $('.add_items').attr('cart-id', response.cart_id);
        }).fail(function(response) {
            alert("Invalid username.");
        });
    }

    function renderSaleItems(items) {
        var $ul = $('.add_items .added_order');
        $ul.html('');
        var qty = 0;
        _.each(items, function(item) {
            if (item.item_type == 'VANITY') {
                return;
            }
            var $listItem = $('<li>');
            var $img = $('<img src="/_ui/images/common/blank.gif">')
                        .css('background-image', 'url(' + item.image_url + ')');
            var option = item.option ? item.option : 'No option';
            $listItem.attr('cart-item-id', item.id);
            $listItem.append($img);
            $listItem.append('<b class="title">' + item.title + '</b>');
            $listItem.append('<span class="option">' + option + '</span>');
            $listItem.append('<span class="price">$' + item.item_price + ' x ' + item.quantity  + '</span>');
            $listItem.append('<span class="remove"><a href="#" class="btns-gray-embo">Remove</a></span>');
            $ul.append($listItem);
            qty += item.quantity;
        });
        $('.add_items .invoice .qty').text(qty + qty > 1 ? 'Items' : 'Item');
    }

    function renderCartSummary(data) {
        $('.add_items .invoice .subtotal_').text(numeral(data.subtotal_price).format("$0,0.00"));
        $('.add_items .invoice .shipping_').text(numeral(data.shipping ? data.shipping : 0).format("$0,0.00"));
        $('.add_items .invoice .tax_').text(numeral(data.tax ? data.tax : 0).format("$0,0.00"));
        
        var totalPrice = data.total_price ? data.total_price : 0;
        if (totalPrice === 0) {
            totalPrice = data.subtotal_price + data.shipping + data.tax;
        }
        $('.add_items .invoice .total_').text(numeral(totalPrice).format("$0,0.00"));
        $('.submit .data-tit b').text('Order Total : ' + numeral(totalPrice).format("$0,0.00"));
    }

    function isValidOrder(saleItemId, optionId, quantity) {
        if (saleItemId === '' || quantity === '') {
            return false;
        }

        if (isNaN(parseInt(saleItemId, 10)) || isNaN(parseInt(quantity, 10))) {
            return false;
        }

        if (optionId !== '' && isNaN(parseInt(optionId, 10))) {
            return false;
        }

        return true;
    }
});