FancyBackbone.Models.User = Backbone.RelationalModel.extend({
  idAttribute: 'id_str',
  isAdminSenior: function() {
    return this.get("is_admin_senior");
  },
  initialize: function() {
    // this.set('dashboard_summary', this.get('dashboard_summary') || new FancyBackbone.Models.Dashboard.Summary({user: this}));
    // this.set('dashboard_map_chart_data', this.get('dashboard_map_chart_data') || new FancyBackbone.Models.Dashboard.MapChartData({user: this}));
    // this.set('dashboard_area_chart_data', this.get('dashboard_area_chart_data') || new FancyBackbone.Models.Dashboard.AreaChartData({user: this}));
    // this.set('product_stat', this.get('product_stat') || new FancyBackbone.Models.Product.Stat({user: this}));
    // this.set('purchase_order_stat', this.get('purchase_order_stat') || new FancyBackbone.Models.PurchaseOrder.Stat({user: this}));
  },
  relations: [
    {
      type: Backbone.HasOne,
      key: 'insights_summary',
      relatedModel: 'Insights.Summary',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasOne,
      key: 'insights_summary_map_chart_data',
      relatedModel: 'Insights.MapChartData',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasOne,
      key: 'insights_summary_area_chart_data',
      relatedModel: 'Insights.AreaChartData',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasOne,
      key: 'product_stat',
      relatedModel: 'Product.Stat',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasOne,
      key: 'purchase_order_stat',
      relatedModel: 'PurchaseOrder.Stat',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'dashboard_shop_activities',
      relatedModel: 'Dashboard.ShopActivity',
      collectionType: 'Dashboard.ShopActivityCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'insights_best_sellers',
      relatedModel: 'Insights.BestSeller',
      collectionType: 'Insights.BestSellerCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'insights_traffic_overall',
      relatedModel: 'Insights.ReferralData',
      collectionType: 'Insights.ReferralDataCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'insights_traffic_fancy',
      relatedModel: 'Insights.InternalReferralData',
      collectionType: 'Insights.InternalReferralDataCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'insights_most_active',
      relatedModel: 'Insights.MostActiveData',
      collectionType: 'Insights.MostActiveDataCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'insights_most_impressions',
      relatedModel: 'Insights.MostImpressionData',
      collectionType: 'Insights.MostImpressionDataCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'insights_popular_item',
      relatedModel: 'Insights.PopularItemData',
      collectionType: 'Insights.PopularItemDataCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'insights_search_keyword',
      relatedModel: 'Insights.SearchKeywordData',
      collectionType: 'Insights.SearchKeywordDataCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'products',
      relatedModel: 'Product.Product',
      collectionType: 'Product.ProductCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'shipping_rate_groups',
      relatedModel: 'ShippingRateGroup',
      collectionType: 'ShippingRateGroupCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'shipping_profiles',
      relatedModel: 'ShippingProfile',
      collectionType: 'ShippingProfileCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'item_profiles',
      relatedModel: 'ItemProfile',
      collectionType: 'ItemProfileCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'purchase_orders',
      relatedModel: 'PurchaseOrder.PurchaseOrder',
      collectionType: 'PurchaseOrder.PurchaseOrderCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'measuring_guides',
      relatedModel: 'MeasuringGuide',
      collectionType: 'MeasuringGuideCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
    {
      type: Backbone.HasMany,
      key: 'saleitem_filters',
      relatedModel: 'SaleItemFilter',
      collectionType: 'SaleItemFilterCollection',
      reverseRelation: {
        type: Backbone.HasOne,
        key: 'user',
        includeInJSON: false,
      }
    },
  ],
});
