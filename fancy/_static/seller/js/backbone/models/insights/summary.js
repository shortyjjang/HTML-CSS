FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.Summary = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/summary/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/summary/%s",
    getDiff: function() {
      var currentValues = this.get('current_values');
      var prevValues = this.get('prev_values');
      var diff = {
        view: currentValues.view - prevValues.view,
        fancyd: currentValues.fancyd - prevValues.fancyd,
        orders: currentValues.orders - prevValues.orders,
        sales: currentValues.sales - prevValues.sales,
        impressions: currentValues.impressions - prevValues.impressions,
        viewRate: +prevValues.view ? (currentValues.view - prevValues.view) / prevValues.view : NaN,
        fancydRate: +prevValues.fancyd ? (currentValues.fancyd - prevValues.fancyd) / prevValues.fancyd : NaN,
        ordersRate: +prevValues.orders ? (currentValues.orders - prevValues.orders) / prevValues.orders : NaN,
        salesRate: +prevValues.sales ? (currentValues.sales - prevValues.sales) / prevValues.sales : NaN,
        impressionsRate: +prevValues.impressions ? (currentValues.impressions - prevValues.impressions) / prevValues.impressions : NaN,
      };

      if( typeof currentValues.sf_affiliate_sales_commission != 'undefined'){
        diff.sf_affiliate_sales_commission = currentValues.sf_affiliate_sales_commission - prevValues.sf_affiliate_sales_commission;
        diff.sf_affiliate_sales_commissionRate = +prevValues.sf_affiliate_sales_commission ? (currentValues.sf_affiliate_sales_commission - prevValues.sf_affiliate_sales_commission) / prevValues.sf_affiliate_sales_commission : NaN;
      }
      if( typeof currentValues.sf_affiliate_sales_revenue != 'undefined'){
        diff.sf_affiliate_sales_revenue = currentValues.sf_affiliate_sales_revenue - prevValues.sf_affiliate_sales_revenue;
        diff.sf_affiliate_sales_revenueRate = +prevValues.sf_affiliate_sales_revenue ? (currentValues.sf_affiliate_sales_revenue - prevValues.sf_affiliate_sales_revenue) / prevValues.sf_affiliate_sales_revenue : NaN;
      }
      return diff;
    },
  }
));
