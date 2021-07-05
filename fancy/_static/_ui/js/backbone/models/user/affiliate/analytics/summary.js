FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Analytics = FancyBackbone.Models.User.Affiliate.Analytics || {};

FancyBackbone.Models.User.Affiliate.Analytics.Summary = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/affiliate/dashboard/summary/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/affiliate/dashboard/summary/%s",
    getDiff: function() {
      var currentValues = this.get('current_values');
      var prevValues = this.get('prev_values');
      return {
        view: currentValues.view - prevValues.view,
        sales: currentValues.sales - prevValues.sales,
        commission: currentValues.commission - prevValues.commission,
        conversion: currentValues.conversion - prevValues.conversion,
        signup: currentValues.signup - prevValues.signup,
        viewRate: +prevValues.view ? (currentValues.view - prevValues.view) / prevValues.view : NaN,
        salesRate: +prevValues.sales ? (currentValues.sales - prevValues.sales) / prevValues.sales : NaN,
        commissionRate: +prevValues.commission ? (currentValues.commission - prevValues.commission) / prevValues.commission : NaN,
        conversionRate: +prevValues.conversion ? (currentValues.conversion - prevValues.conversion) / prevValues.conversion : NaN,
        signupRate: +prevValues.signup ? (currentValues.signup - prevValues.signup) / prevValues.signup : NaN,
      };
    },
  }
));
