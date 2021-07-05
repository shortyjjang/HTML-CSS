jQuery(function($) {
    $.get('/'+window.owner_username+'/fancyd-categories.json', function(res) {
        if(res.status_code==1 && res.root_category_ids) {
            var fancyd_root_categories = {}
            for(var i in res.root_category_ids) {
                fancyd_root_categories[res.root_category_ids[i]] = true
            }
            $('.category-filter [data-sale_category]').each(function(i,el) {
                var sale_category_id = $(el).data('sale_category')
                if(!fancyd_root_categories[sale_category_id]) {
                    if($(el).parent('li').length) {
                        $(el).parent('li').remove()
                    } else {
                        $(el).remove()
                    }
                }
            })
        }
    })
})
