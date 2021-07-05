FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.AddQuantityPopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_add_quantity',
    events: {
        'click .btn-add': 'onAddButtonClick',
        'change .qty-option': 'onOptionQtyChange',
        'change #sync_qty_checkbox': 'onSyncChange',
        'change .sync_qty_option': 'onOptionSyncChange',
    },
    templateData: function () {
        return {
        };
    },
    open: function () {
        $.dialog("add_qty").open();
        this.$el.find('.qty-to-add').focus();
    },
    validateData: function () {
        var qtyToAdd =  this.$el.find('.qty-to-add').val();
        if (!$.isNumeric(qtyToAdd) || Math.floor(qtyToAdd) != qtyToAdd || parseInt(qtyToAdd) < 0) {
            alert(gettext('Quantity should be positive integer.'));
            this.$el.find('.qty-to-add').val('').focus();
            return false;
        }
        return true;
    },
    syncModel: function () {
        var qtyToAdd = parseInt(this.$el.find('.qty-to-add').val()),
            that = this,
            prevQty, updateTarget;

        if (this.option) {
            var options = this.productDetail.get('options').map(function (option) { return option; });
            updateTarget = _.find(options, function (option) { return option.get('id') == that.option.get('id') });
        } else {
            updateTarget = this.productDetail;
            if(updateTarget.get('options').length){
                updateTarget.get('options').each(function(v){
                    var numSold = parseInt(v.get('num_sold'))||0;
                    v.set('quantity', (parseInt(that.$el.find("input.qty-option[option-id="+v.id+"]").val())||0) + numSold );
                    if( seller.get('has_fancy_warehouse_access_right') ){
                        v.set('sync_quantity_with_warehouse', that.$el.find("input#sync_qty_"+v.id).is(":checked") );
                    }
                })            
            }
        }

        numSold = parseInt(updateTarget.get('num_sold'))||0;
        updateTarget.set('quantity', qtyToAdd+numSold);

        if( seller.get('has_fancy_warehouse_access_right') ){
            updateTarget.set('sync_quantity_with_warehouse', $("#sync_qty_checkbox").is(":checked") );
        }

        var dateFields = ['start_date', 'end_date'],
            dateValue;
        _.each(dateFields, function (dateField) {
            dateValue = that.productDetail.get(dateField);
            if (dateValue) {
                that.productDetail.set(dateField, moment(dateValue).format('MM/DD/YYYY'));
            }
        });
    },
    saveProductDetail: function () {
        var that = this;
        this.productDetail.save().success(function () {
            that.sourceView.render();
        }).error(function (jqXHR) {
            var message = jqXHR.responseJSON && jqXHR.responseJSON.message || gettext('Failed to add quantity. Please try again later.');
            alert(message);
        }).always(function () {
            $.dialog("add_qty").close();
        });
    },
    onAddButtonClick: function () {
        if (this.validateData()) {
            this.syncModel();
            this.saveProductDetail();
        }
    },
    onOptionQtyChange: function(){
        var sum = 0;
        this.$el.find("input.qty-option").each(function(){
            sum += (parseInt(this.value)||0);
        })
        this.$el.find("input.qty-to-add").val(sum);
    },
    onSyncChange: function(e){
        var $this = $(e.target);
        var checked = $this.is(":checked");        
        if(checked){
            $this.closest('.qty').addClass('checked');
            this.$el.find('input.text').attr('disabled','disabled');
            this.$el.find('p.option input:checkbox').attr('checked','checked').attr('readonly','true');
        }else{
            $this.closest('.qty').removeClass('checked');
            this.$el.find('input.text').removeAttr('disabled');
            this.$el.find('p.option input:checkbox').removeAttr('readonly');
        }
    },
    onOptionSyncChange: function(e){
        var $this = $(e.target);
        var checked = $this.is(":checked");        
        if(checked){
            $this.closest('.qty').addClass('checked');
            this.$el.find('input.text').attr('disabled','disabled');
        }else{
            $this.closest('.qty').removeClass('checked');
            this.$el.find('input.text').removeAttr('disabled');
        }
    },
    render: function (sourceView, product, option) {       

        var that = this;
        var superFn = this._super;
        superFn.apply(that);

        that.open();
        $("#popup_container").addClass('loading');

        this.sourceView = sourceView;
        this.productDetail = FancyBackbone.Models.Product.Product.find({
            id_str: product.get('id_str'),
            user: window.seller
        });
        this.option = option || null;

        $.when(this.productDetail.fetch()).done(function () {            

            that.$el.find('.qty-to-add').val( Math.max(0, (that.productDetail.get('quantity')||0)-(that.productDetail.get('num_sold')||0) ) );
            if(that.productDetail.get('options').length){
                that.productDetail.get('options').each(function(v){
                    that.$el.find("fieldset").append("<p class='option'><label>Quantity</label><span class='qty hastext'><input type='text' class='text qty-option'  name='quantity' option-id=\""+v.id+"\" value='"+Math.max(0, ((v.get('quantity')||0)-(v.get('num_sold')||0)))+"'><input type='checkbox' class='sync_qty_option' id='sync_qty_"+v.id+"' ><label for='sync_qty_"+v.id+"'><span class='tooltip'><i class='icon'></i> Sync<em><b>Sync with warehouse</b> Sync this product with warehouse quantity. Turning this feature on will disable manual input of quantity.</em></span></label></span></p>");
                    that.$el.find("fieldset").find("input[option-id="+v.id+"]").closest("p").find(" > label").text(v.get("name"));
                    that.$el.find("fieldset").find("input[option-id="+v.id+"]").trigger('change');
                })                
                that.$el.find('.qty-to-add').attr("readonly","true");
            }
        
            if( seller.get('has_fancy_warehouse_access_right') ){
                that.$el.find('.warehouse p:eq(0) > span').addClass("qty").find("#sync_qty_checkbox, label").show();
                if(that.productDetail.get("sync_quantity_with_warehouse")){
                    that.$el.find("#sync_qty_checkbox").attr('checked','checked').trigger('change');
                }else{
                    that.productDetail.get('options').each(function(v){
                        that.$el.find("fieldset").find("input#sync_qty_"+v.id).attr('checked', v.get("sync_quantity_with_warehouse")).trigger('change');
                    });
                }
            }else{
                that.$el.find('.warehouse p > span').removeClass("qty").find("input:checkbox, label").hide();
            }
            $("#popup_container").removeClass('loading');
        });
        return this;
    }
});