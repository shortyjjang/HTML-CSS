FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.AddItemToCollectionPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: FancyBackbone.Utils.loadTemplate('popup_add_item_to_collection'),
    itemTemplate: FancyBackbone.Utils.loadTemplate('popup_add_item_to_collection_item'),
    events: {
        'click li > a': 'onClickItem',
        'keypress .search > input': 'onSearchString',
        'click .btn-save': 'onClickSave',
    },
    initialize: function(option) {
        this.scrollDetectFlag = false;
        this.onScrollDetect = _.bind(this.onScrollDetect, this);
    },
    reset: function() {
        this.page = 1;
        this.search_str = null;
        this.selectedIds = [];
        this.scrollDetectFlag = false;
    },
    onClickItem: function(e) {
        e.preventDefault();
        var $currentTarget = $(e.currentTarget);
        $currentTarget.toggleClass('on');
        var sid = $currentTarget.attr('sid');

        if ($currentTarget.hasClass('on')) {
            this.selectedIds.push(sid);
            this.selectedIds = _.union(this.selectedIds);
        } else {
            this.selectedIds = _.without(this.selectedIds, sid);
        }
    },
    onSearchString: function(e) {
        if (e.keyCode != 13 ) return;
        e.preventDefault();

        var search_str = $(e.currentTarget).val();
        if (search_str === '') {
            alert("Enter the search string. ");
            return;
        }

        this.search_str = search_str;
        this._render(true);
    },
    onClickSave: function(e) {
        var that = this;
        $.post(
            "/merchant/products/collections/add_items.json",
            { 'collection_id': that.collectionId, 'sale_item_ids': that.selectedIds.join(',') },
            function(json){
                if (json.status_code == 1) {
                    that.trigger('saved');
                    that.close();
                }
                else {
                    var msg = json.message;
                    if (msg && msg !== '') {
                        alert(msg);
                    }
                }
            }, "json");
    },
    onScrollDetect: function(e) {
        if (!this.scrollDetectFlag) return;
        if ( this.$el.find('.collection-list').scrollTop() + this.$el.find('.collection-list').height() >= this.$el.find('ul')[0].scrollHeight ) {
            this.page += 1;
            this.scrollDetectFlag = false;
            this._render();
        }
    },
    open: function () {
        $.dialog("add_collection").open();
    },
    close: function() {
        $.dialog("add_collection").close();
        this.scrollDetectFlag = false;
    },
    render: function(collectionId) {
        this.reset();
        this.collectionId = collectionId;
        this.$el.html(this.template());
        this.open();

        this.$el.find('.collection-list').bind('scroll', this.onScrollDetect);

        this.collection = new FancyBackbone.Collections.Product.ProductCollection({
            seller: window.seller,
        });

        this._render();
        return this;
    },
    _render: function(redraw) {
        this.$el.find('#infscr-loading').show();
        if (redraw) {
            this.$el.find('.ul').html('');
        }
        var that = this;
        var params = {'page': this.page };
        if ( this.search_str !== null && this.search_str !== '' ) {
            params['search[field]'] = 'title';
            params['search[text]'] = this.search_str;
        }
        this.collection.fetch({ 'data': params }).success(function() {
            if (that.page == that.collection.maxPage) {
                that.scrollDetectFlag = false;
            } else {
                that.scrollDetectFlag = true;
            }
            that._renderContent();
            that.$el.find('#infscr-loading').hide();
        });
    },
    _renderContent: function() {
        _.each(this.collection.models, function(item) {
            var $el = $("<li>");
            $el.html(this.itemTemplate(item.attributes));
            this.$el.find("ul").append($el);
        }, this);
    },
    undelegateEvents: function() {
        FancyBackbone.Views.Base.TemplateView.prototype.undelegateEvents.apply(this, arguments);
        this.$el.find('.collection-list').unbind('scroll', this.onScrollDetect);
    }
});