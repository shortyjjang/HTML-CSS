$(function(){

  var orignal_item_ids = [], changed_item_ids = [];

  $('.actions a.organize').click(function(e){
    e.preventDefault();
    $(".actions.in-overlay").hide();
    $(".actions.organize").show();
    return false;
  });

  $('.actions.organize a.cancel').click(function(e){
    e.preventDefault();
    $(".actions.in-overlay").show();
    $(".actions.organize").hide();
    return false;
  });

  $('.itemListElement').on('click', '.remove', function() {
    var $item = $(this).closest('.itemListElement')
    if ($item.hasClass('_removing')) {
        return;
    }
    $item.addClass('_removing')
    var sid = $item.attr('data-sale-item-id')

    var collection_id = $("#summary").attr('object-id');
    $.ajax({
        method: 'DELETE',
        url: '/collection/items/' + collection_id + '/' + sid
    })
    .done(function(res){
        if (typeof res === 'object' && res.status === 0) {
            window.alertify.alert(res.error);
        } else {
            $item.remove();
            if ($('.itemListElement').length === 0) {
                $('.empty-result').removeClass('_hidden')
            }
        }
    })
    .always(function(){
        $item.removeClass('_removing')
    })
    return false
  })

  $("ol.cols-3")
      .find("li[data-sale-item-id] *").css('cursor','move').end()
      .sortable({ 
        items: "li[data-sale-item-id]",
        tolerance: "intersect",
        forcePlaceholderSize: true,
        forceHelperSize: true,
        containment: "parent",
        helper: "clone",
        scroll:false,
        start: function(event, ui){
            orignal_item_ids = [];
            $(".ui-sortable-placeholder").height( $('ol.cols-3 > li[data-sale-item-id]:visible:eq(0)').height() );
            $('ol.cols-3 > li[data-sale-item-id]:visible').each(function(){ orignal_item_ids.push( $(this).attr('data-sale-item-id') )});
            $('.cols-3 > li:visible').each(function(index){
                if (index%3 > 0){
                    $(this).css({marginLeft:'50px',clear:'none'});
                }else{
                    $(this).css({marginLeft:0,clear:'both'});
                }
            });
        },
        over: function(event, ui){
            $('.ui-sortable-helper').offset({top: ui.offset.top})
        },
        sort: function(event, ui){
            $('.ui-sortable-helper').offset({top: ui.offset.top})
        },
        change: function(){
            $('.cols-3 > li:visible').each(function(index){
                if(index%3 > 0){
                    $(this).css({marginLeft:'50px',clear:'none'});
                }else{
                    $(this).css({marginLeft:0,clear:'both'});
                }
            });
        },
        stop : function(event, ui){
            $('.cols-3 > li:visible').each(function(index){
                if (index%3 > 0){
                    $(this).css({marginLeft:'50px',clear:'none'});
                }else{
                    $(this).css({marginLeft:0,clear:'both'});
                }
            });
            changed_item_ids = [];
            $('ol.cols-3 > li[data-sale-item-id]').each(function(){ changed_item_ids.push( $(this).attr('data-sale-item-id') )});
            if(orignal_item_ids.join(',') == changed_item_ids.join(',')) return;

            var collection_id = $("#summary").attr('object-id');
            var params = {
                remain_items   : changed_item_ids.join(','),
                original_items : orignal_item_ids.join(',')
            };

            $.ajax({
                type : 'post',
                url  : '/collection/items/'+collection_id+'/organize',
                data : params,
                dataType : 'json',
                success  : function(json){
                    if (typeof res === 'object' && res.status === 0) {
                        window.alertify.alert(res.error);
                    } else {
                        $item.remove();
                        if ($('.itemListElement').length === 0) {
                            $('.empty-result').removeClass('_hidden')
                        }
                    }
                    if(!json.id){
                        alertify.alert("Update Failed! Please try again.");
                    }
                },
                error : function(res){
                    alertify.alert("Update Failed! Please try again.");
                }
            });
        }
      });
});