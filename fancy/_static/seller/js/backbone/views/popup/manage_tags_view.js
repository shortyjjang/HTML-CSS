FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.ManageTagsPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_manage_tags',
    events: {
        'click .btn-save': 'onAddButtonClick',
        'keydown .multi-text input': 'onTagDelete',
        'keypress .multi-text input': 'onTagEntered',
        'click .multi-text a.btn-del': 'onClickDeleteTag',
    },
    templateData: function () {
        return {
        };
    },
    open: function (product) {
        this.render(product);
        $.dialog("mng-tags").open();
    },
    onTagDelete: function(event) {
        if (event.keyCode != 8) return;
       
        if( $(event.currentTarget).val() ) return;
        event.preventDefault();
        $(event.currentTarget).prev('span').remove();

        return false;
    },
    onTagEntered: function(event) {
        if (event.keyCode != 13 && event.keyCode != 44 ) return;
       
        event.preventDefault();
        var tag = $('.tags input.add').val();
        this.addTag(tag); 
        $('.tags input.add').focus();
    },
    onClickDeleteTag: function(e) {
        e.preventDefault();
        $(e.currentTarget).closest('span').remove();

        return false;
    },
    onAddButtonClick: function(e){
        e.preventDefault();
        var tag = $('.tags input.add').val();
        if(tag) this.addTag(tag); 

        this.syncModel();
        this.product.set('action','manage-tags');
        this.product.save().success(function(){
            $.dialog("mng-tags").close();
        }).fail(function(){
            alert("update tags failed. please try again");
        });
    },
    getSelectedTags: function() { 
        var keywords = [];
        _.each( this.$el.find(".multi-text span"), function(tag) {
          keywords.push($(tag).attr('name'));
        });
        return keywords; 
    },
    addTag: function(tag) { 
        if (!tag || tag === '') return;
        var keywords = this.getSelectedTags(); 
        if(_.find(keywords, function(keyword) { return keyword == tag }) != undefined) { 
          return false; 
        }
        var $span = $('<span><a href="#" class="btn-del"><i class="icon"></i></a></span>');
        $span.attr("name", tag);
        $span.prepend(document.createTextNode(tag));
        this.$el.find('.multi-text').append($span);
        var input = this.$el.find('.multi-text input.add'); 
        input.val(''); 
        this.$el.find('.multi-text').append(input); 

    }, 
    syncModel: function() {
        var keywords = this.getSelectedTags(); 
        this.product.set('keywords', keywords.join(','));
    },
    syncView: function(e) { 
        var that = this;
        var keywords = this.product.get('keywords').split(","); 
        _.each(keywords, function(tag) { 
          that.addTag(tag); 
        }); 
    },
    render: function(product) { 
        this.product = product;

        var that = this;
        var superFn = this._super;
        superFn.apply(that);    

        if(this.product.get('keywords')) { 
          this.syncView(); 
        }
        
        return this; 
    },
});
