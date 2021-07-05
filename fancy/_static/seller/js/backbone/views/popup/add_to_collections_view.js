FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.AddToCollectionsPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_add_to_collections',
    events: {
        'click .btn-save': 'onAddButtonClick',
        'click .category-lists a': 'onCollectionSelect',
    },
    templateData: function () {
        return {
        };
    },
    open: function (product_ids) {
        this.render(product_ids);
        $.dialog("add_collection").open();
    },    
    onAddButtonClick: function () {
        var list_ids = this.$el.find(".category-lists a.selected").map(function(){
            return $(this).attr('value');
        })

        if( !list_ids.length){
            alert("Please select collections");
            return;
        }

        $.post(expand_url('/add_items_to_collection.xml'), {'siids': this.product_ids,'list_id': [].splice.call(list_ids,0).join(",") }, function(res){
            $.dialog("add_collection").close();
        }, 'xml').fail(function(e){
            alertify.alert("Add to collections failed. please try again");
        })
        
    },
    onCollectionSelect: function(e){
        e.preventDefault();
        var $this = $(e.target), lid=$this.attr('value'), lname = $this.text();
        if(!lid) return;
        if($this.attr('disabled')) return

        $this.toggleClass('selected');
    },
    render: function (product_ids) {
        var that = this;
        var superFn = this._super;
        superFn.apply(that);
        this.product_ids = product_ids;

        var hasSameCollections = true;
        var cids;
        this.product_ids.split(",").forEach(function(v,i){
            var _cids = window.productListingView.collection.get(parseInt(v)).get('collection_ids').sort();
            if(!cids) cids = _cids;
            else{
                if(cids.join("-") != _cids.join("-")){
                    hasSameCollections = false;
                    return false;
                }
            }
        })

        var collections = that.$el.find(".category-lists");
        if( collections.find("li").length == 0){
            $.get('/rest-api/v1/seller/'+window.seller.id+'/collections', {'page_size':999}, function(res){
                res.collections.forEach(function(v){
                    if(hasSameCollections && cids.indexOf(v.id) > -1){
                        collections.append("<li><a href='#' value='"+v.id+"' class='selected' disabled='true'>"+v.name+"</a></li>");    
                    }else{
                        collections.append("<li><a href='#' value='"+v.id+"'>"+v.name+"</a></li>");
                    }
                })
                $.dialog("add_collection").center();
            }, 'json');
        }
        return this;
    }
});