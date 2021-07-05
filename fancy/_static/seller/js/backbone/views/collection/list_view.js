FancyBackbone.Views.Collection = FancyBackbone.Views.Collection || {};

FancyBackbone.Views.Collection.ListView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate('collection_list'),
    listItemTemplate: FancyBackbone.Utils.loadTemplate('collection_list_item'),
    emptyTemplate: FancyBackbone.Utils.loadTemplate('collection_empty_list'),
    events: {
        'click .btn-add': 'onClickCreateButton',
        'click .edit-list': 'onClickEditButton',
        'scroll': 'onScrollDetect',
    },
    initialize: function(option) {
        this.seller = window.seller;
        this.page = 1;
        this.scrollDetectFlag = false;

        _.bindAll(this, 'onScrollDetect');


        $(window).scroll(this.onScrollDetect);

    },
    onClickCreateButton: function(e) {
        e.preventDefault();
        this._openPopup();
    },
    onClickEditButton: function(e) {
        e.preventDefault();
        this._openPopup($(e.currentTarget).parent().attr('collection-id'));
    },
    onScrollDetect: function(e) {
        if (!this.scrollDetectFlag) return;
        if ($(window).scrollTop() + $(window).height() >= this.$el.position().top + this.$el.height() ) {
            this.page += 1;
            this.scrollDetectFlag = false;
            this._render();
        }
    },
    _openPopup: function(collectionId){
        this.stopListening();
        this.listenTo(window.popups.createCollection, 'saved', this.refresh);
        window.popups.createCollection.render(collectionId);
    },
    refresh: function() {
        this.page = 1;
        this.scrollDetectFlag = false;
        this.render();
    },
    render: function() {
        var self = this;

        this.$el.html(this.template());
        this._render();
        this.$el.find(".lists-listing").sortable({
            items:"li.vcard[cid]", 
            tolerance : 'intersect',
            helper: "clone",
            forcePlaceholderSize: true,
            forceHelperSize: true,
            scroll:false,
            containment: 'parent',
            start: function(event, ui){
                var index = 0;
                $('.vcard[cid]:visible,.vcard.ui-sortable-placeholder').each(function(){
                  if(index%3){
                    $(this).css({marginLeft:'17px',clear:'none'});
                  }else{
                    $(this).css({marginLeft:0,clear:'both'});
                  }
                  index++;
                });
            },
            over: function(event, ui){
                $('.ui-sortable-helper').offset({top: ui.offset.top})
            },
            sort: function(event, ui){
                $('.ui-sortable-helper').offset({top: ui.offset.top})
            },
            change: function(){
                var index = 0;
                $('.vcard[cid]:visible,.vcard.ui-sortable-placeholder').each(function(){
                  if(index%3){
                    $(this).css({marginLeft:'17px',clear:'none'});
                  }else{
                    $(this).css({marginLeft:0,clear:'both'});
                  }
                  index++;
                });
            },
            update: function(){
                var collection_ids = [];
                self.$el.find('.lists-listing .vcard[cid]').each(function(){
                  var cid = $(this).removeAttr('style').attr('cid');
                  if (cid != undefined) {
                    collection_ids.push(cid+'');
                  }
                });
                var param = {};
                if(window.user.get('is_admin_senior') ){
                    param.seller_id=window.seller.id;
                }
                param['collection_ids']=collection_ids.join(",");
                $.post( FancyBackbone.Utils.makeURL("/merchant/products/collections/organize-collections.json",false), param, function(json){
                  console.log(json);
                }, "json");
            }

        });
        return this;
    },
    _render: function() {
        this.$el.find('#infscr-loading').show();
        this.model = new FancyBackbone.Models.Collection.List({
            seller: this.seller.id,
            page: this.page,
            per_page: 100,
        });
        var that = this;
        this.model.fetch().success(function() {
            if (that.page == 1 && that.model.attributes.collections.length === 0) {
                that.$el.html(that.emptyTemplate());
                return;
            }
            if (that.page == that.model.attributes.max_page) {
                that.scrollDetectFlag = false;
            } else {
                that.scrollDetectFlag = true;
            }
            that._appendContents();
            that.$el.find('#infscr-loading').hide();
        });
    },
    updateView: function(sellerId, page, per_page, sort_option, sort_ascending) {
        this.sellerId = sellerId ? sellerId : window.seller.id;
        this.page = page;
        this.per_page = per_page;
        this.sort_option = sort_option;
        this.sort_ascending = sort_ascending;
        this._render();
    },
    _appendContents: function() {
        _.each(this.model.attributes.collections, function(collection) {
          var $el = $("<li class='vcard'>");
          $el.html(this.listItemTemplate(collection));
          $el.attr('cid', collection.id);
          this.$el.find("ul").append($el);
        }, this);
    },
});
