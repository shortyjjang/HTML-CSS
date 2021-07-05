FancyBackbone.Views.Collection = FancyBackbone.Views.Collection || {};

FancyBackbone.Views.Collection.ItemListView = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate('collection_itemlist'),
    listItemTemplate: FancyBackbone.Utils.loadTemplate('collection_itemlist_item'),
    events: {
        'scroll .data-field': 'onScrollDetect',
        'click .btns .btn-add': 'onClickAddButton',
        'click .btns .btn-del': 'onClickDelButton',
    },
    initialize: function(option) {
        this.seller = window.seller;
        this.page = 1;
        this.per_page = 24;
        this.collectionId = option.collectionId;
        this.scrollDetectFlag = false;

        _.bindAll(this, 'onScrollDetect');
        $(window).scroll(this.onScrollDetect);
    },
    onScrollDetect: function(e) {
        if (!this.scrollDetectFlag) return;
        if ($(window).scrollTop() + $(window).height() >= this.$el.position().top + this.$el.height() ) {
            this.page += 1;
            this.scrollDetectFlag = false;
            this._render();
        }
    },
    onClickAddButton: function(e) {
        e.preventDefault();
        this.stopListening();
        this.listenTo(window.popups.addItems, 'saved', this.refresh);
        window.popups.addItems.render(this.collectionId);
    },
    onClickDelButton: function(e) {
        e.preventDefault();
        var that = this;
        var $tr = $(e.currentTarget).closest('tr');
        $.post(
            "/merchant/products/collections/remove-items.json",
            { 'collection_id': that.collectionId, 'sale_item_ids': $tr.attr('sid') },
            function(json){
                if (json.status_code == 1) {
                    $tr.remove();
                }
                else {
                    var msg = json.message;
                    if (msg && msg !== '') {
                        alert(msg);
                    }
                }
            }, "json");
    },
    refresh: function() {
        this.page = 1;
        this.scrollDetectFlag = false;
        this.render();
    },
    _render: function() {
        var that = this;
        this.$el.find('#infscr-loading').show();
        this.model = new FancyBackbone.Models.Collection.ItemList({
            collection: this.collectionId,
            seller: this.seller.id,
            page: this.page,
            per_page: this.per_page,
        });
        this.model.fetch().success(function() {
            if (that.model.attributes.items.length < that.per_page) {
                console.log(that.model.attributes.items.length);
                that.scrollDetectFlag = false;
            } else {
                that.scrollDetectFlag = true;
            }
            that._appendContents();
            that.$el.find('#infscr-loading').hide();
        });
    },
    render: function() {
        this.$el.html(this.template());
        this._render();
        return this;
    },
    _appendContents: function() {
        _.each(this.model.attributes.items, function(item) {
          var $el = $("<tr>").attr('sid', item.sale_item_id);
          $el.html(this.listItemTemplate(item));
          this.$el.find("tbody").append($el);
        }, this);
    },
});
