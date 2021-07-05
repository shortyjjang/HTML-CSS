FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.WhitelabelTagPopup = Backbone.View.extend({
    events: {
        'click li a[data-tag]': 'onTagClick',
        'click .btn-save': 'onSaveClick',
        'click .btn-cancel': 'onCancelClick',
    },
    types: {
        102 : 'professions',
        103 : 'regions',
    },
    onTagClick: function(e){
        e.preventDefault();
        $(e.target).toggleClass('selected');
    },
    onCancelClick: function(e){
        e.preventDefault();
        this.dialog.close();
    },
    onSaveClick: function(e){
        e.preventDefault();
        var tags = Array.prototype.slice.call(this.$el.find("li a[data-tag].selected").map(function(){ return $(this).data('tag');}));
        if( 'condition' in this.model ) {
            this.model.condition.tags[this.type] = tags;
        }
        if( 'tags' in this.model ) {
            this.model.tag_type = this.type;
            this.model.tags = tags;
        }
        FancyBackbone.App.eventAggregator.trigger("update:whitelabeltag", this.model);
        this.dialog.close();
    },
    open: function (model) {
        this.render(model);
        this.dialog.open();
    }
});

FancyBackbone.Views.Popup.WhitelabelProfessionPopup = FancyBackbone.Views.Popup.WhitelabelTagPopup.extend({
    render: function (object) {
        var that = this;
        this.model = object;
        this.type = 102;
        this.dialog = $.dialog("select-"+this.types[this.type]);
        this.$el.find("a[data-tag]").removeClass('selected');
        return this;
    }
});

FancyBackbone.Views.Popup.WhitelabelRegionPopup = FancyBackbone.Views.Popup.WhitelabelTagPopup.extend({
   render: function (object) {
        var that = this;
        this.model = object;
        this.type = 103;
        this.dialog = $.dialog("select-"+this.types[this.type]);
        this.$el.find("a[data-tag]").removeClass('selected');
        return this;
    } 
});