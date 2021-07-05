FancyBackbone.Models.ItemProfile = Backbone.RelationalModel.extend({
  idAttribute: 'id_str',
  relations: [
    {
      type: Backbone.HasMany,
      key: 'pending_sale_order_items',
      relatedModel: 'SaleOrderItem',
      collectionType: 'SaleOrderItemCollection',
      reverseRelation: {
        key: 'item_profile',
        includeInJSON: false,
      },
    }, {
      type: Backbone.HasOne,
      key: 'product',
      relatedModel: 'Product.Product',
    }
  ],
});

FancyBackbone.Collections.ItemProfileCollection = Backbone.Collection.extend(_.extend(
  {},
  FancyBackbone.Mixins.FormatURLMixin,
  {
    model: FancyBackbone.Models.ItemProfile,
    urlFormat: "/rest-api/v1/seller/%s/item-profiles/%s",
    urlParams: function() {
      return [
        this.user.id,
        this.filter
      ];
    },
    parse: function(response) {
      this.hasNextPage = response.has_next_page;
      this.hasPrevPage = response.has_prev_page;
      this.currentPage = response.current_page;
      this.filter = response.filter;
      return response.item_profiles;
    },
  }
));
