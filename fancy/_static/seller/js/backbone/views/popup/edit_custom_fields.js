FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.EditCustomFieldsPopup = FancyBackbone.Views.Base.TemplateView.extend({
    events: {
        'click .btn-add': 'onAddButtonClick',
        'click .btn-del': 'onDeleteButtonClick',
        'click .btn-save': 'onSaveButtonClick',
        'click .btn-close': 'onCloseButtonClick'
    },
    open: function (product) {
        this.render(product);
        $.dialog("custom_product").open();
    },    
    onSaveButtonClick: function () {
        var fields = this.$el.find("ul > li"); 
        var metadata = {};
        var isValid = true;
        fields.each(function(){
            var key = $(this).find(".key input").val();
            var value = $(this).find(".val input").val();
            
            if(key){
                if( typeof(metadata[key]) == 'string' ){
                    $(this).find(".key input").addClass('error');
                    isValid=false;
                }else{
                    metadata[key] = value||"";
                }
            }
        })
        if(!isValid){
            return;
        }
        FancyBackbone.App.eventAggregator.trigger("update:customfields", metadata);
        $.dialog("custom_product").close();
    },
    onCloseButtonClick: function(e){
        $.dialog("custom_product").close();
    },
    onAddButtonClick: function(e){
        this.addCustomField();
    },
    onDeleteButtonClick: function(e){
        $(e.currentTarget).closest('li').remove();
        if( this.$el.find("ul li").length == 1 ) this.$el.find("ul li .btn-del").attr('disabled','disabled');
    },
    addCustomField: function(key, val){
        var template = this.$el.find("ul > script").html();
        var field = $(template);
        if(key) field.find(".key input").val(key);
        if(val) field.find(".val input").val(val);
        this.$el.find("ul").append(field);
        if( this.$el.find("ul li").length > 1 ) this.$el.find("ul li .btn-del").removeAttr('disabled');
    },
    render: function (product) {
        var that = this;
        var superFn = this._super;
        this.product = product;
        
        if(product.get('metadata')){
            var metadata = product.get('metadata');
            var keys = Object.keys(metadata).sort();
            
            this.$el.find("ul li").remove();
            if(keys.length){
                $(keys).each(function(){
                    if( metadata[this] != null){
                        that.addCustomField(this, metadata[this]);
                    }
                })
            }else{
                this.addCustomField();    
            }
        }else{
            this.addCustomField();
        }
        return this;
    }
});