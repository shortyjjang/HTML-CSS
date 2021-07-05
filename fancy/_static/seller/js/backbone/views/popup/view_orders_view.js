FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};

FancyBackbone.Views.Popup.ViewOrdersPopupListItem = FancyBackbone.Views.Base.TemplateModelView.extend({
  template: 'popup_view_orders_list_item',
  tagName: 'tr',
});

FancyBackbone.Views.Popup.ViewOrdersPopup = FancyBackbone.Views.Base.TemplateCollectionView.extend({
  template: 'popup_view_orders',
  listItemViewClass: FancyBackbone.Views.Popup.ViewOrdersPopupListItem,
  listSelector: 'table tbody',
  events: {
    'click td.dis a': 'onClickDisassociate',
    'click ._close': 'onClickClose',
  },
  render: function(saleOrderCollection) {
    this.collection = saleOrderCollection;
    var superFn = this._super;
    var that = this;
    this.collection.fetch().fail(function(){
      that.collection.models = [];
    }).always(function() {
      superFn.apply(that);      
      that.open();
    })
    return this;
  },
  open: function() {
    $.dialog("view-orders").open();
  },
  onClickDisassociate : function(e){
    e.preventDefault();
    var poi_id = $(e.target).attr('poi-id');
    $.post('/admin/disassociate-po-item.json', {poi_id: poi_id}, function(response) {
        if (response.status_code == 1) location.reload(false);
        else alert('Failed: ' + response.message);
    }, 'json');
  },
  onClickClose : function(){
    $.dialog("view-orders").close();
  }
});