FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.ImportProductsPopup = FancyBackbone.Views.Base.TemplateView.extend({
  template: 'popup_import_products',
  events: {
    'click .btn-upload': 'onUploadButtonClick',
    'click .btn-sample': 'onSampleButtonClick',
    'click .btn-shopify-upload': 'onShopifyUploadButtonClick',
    'click .btn-bigcommerce-upload': 'onBigCommerceUploadButtonClick',
    'click .btn-volusion-upload': 'onVolusionUploadButtonClick',
    'click .btn-etsy-upload': 'onEtsyUploadButtonClick'
  },
  templateData: function() {
    return {      
    };
  },
  open: function() {
    $.dialog("important").open();
    $('.popup.important .scroll').scroll(function(){
        $('.popup.important').find('.tooltip.trick').css('top',$('.popup.important .scroll .tooltip').position().top+'px').css('left',$('.popup.important .scroll .tooltip').position().left+'px');
    });
  },
  onUploadButtonClick: function() {
    this.$el.find("#import-product-list-file").click();
    //$.dialog("important").close();
  },
  onSampleButtonClick: function() {
    $("#sampledown").remove();  
    $("<iframe id='sampledown' src='/merchant/products/sample.csv' style='width:0;height:0'></iframe>").appendTo(document.body);
  },
  onShopifyUploadButtonClick: function() {
    this.$el.find("#import-shopify-products-file").click();
  },
  onBigCommerceUploadButtonClick: function() {
    this.$el.find("#import-bigcommerce-products-file").click();
  },
  onVolusionUploadButtonClick: function() {
    this.$el.find("#import-volusion-products-file").click();
  },
  onEtsyUploadButtonClick: function() {
    this.$el.find("#import-etsy-products-file").click();
  },
  render: function() {
    var that = this;
    var superFn = this._super;
    superFn.apply(that);    
    var queryString = $.param(_.pick(window.params, ['seller_id']));
    var upload_callback = function(e, data) {
          if (data.result.status_code) {
            alert("Importing is in progress. We will send you an email when we finish.");
          } else if (data.result.message) {
            alert("There was an error while importing: " + data.result.message);
          } else {
            alert("There was some error while importing. Please check the file and try it again.");
          }
          $.dialog('important').close();
      };
    this.$el.find("#import-product-list-file").fileupload({
      dataType: 'json',
      url: '/merchant/products/upload-csv.json?' + queryString,
      done: upload_callback
    });
    this.$el.find("#import-shopify-products-file").fileupload({
      dataType: 'json',
      url: '/merchant/products/upload-shopify-csv.json?' + queryString,
      done: upload_callback
    });
    this.$el.find("#import-bigcommerce-products-file").fileupload({
      dataType: 'json',
      url: '/merchant/products/upload-bigcommerce-csv.json?' + queryString,
      done: upload_callback
    });
    this.$el.find("#import-volusion-products-file").fileupload({
      dataType: 'json',
      url: '/merchant/products/upload-volusion-csv.json?' + queryString,
      done: upload_callback
    });
    this.$el.find("#import-etsy-products-file").fileupload({
      dataType: 'json',
      url: '/merchant/products/upload-etsy-csv.json?' + queryString,
      done: upload_callback
    });
    that.open();
    return this;
  },
});
