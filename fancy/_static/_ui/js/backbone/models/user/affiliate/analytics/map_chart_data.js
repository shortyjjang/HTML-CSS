FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Analytics = FancyBackbone.Models.User.Affiliate.Analytics || {};
FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Analytics = FancyBackbone.Collections.User.Affiliate.Analytics || {};

FancyBackbone.Models.User.Affiliate.Analytics.MapChartData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/affiliate/dashboard/map-chart-data/%s/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/affiliate/dashboard/map-chart-data/%s/%s",
    urlParams: function() {
      var range = this.get('range');
      var ret = [
        this.get('log_type'),
        range
      ];
      if (range == 'specific') {
        var dateRange = this.getDateRange();
        ret.push(dateRange[0].format("YYYYMMDD"));
        ret.push(dateRange[1].format("YYYYMMDD"));
      }
      return ret;
    },
    getBubbleData: function(radiusScale) {
      var rawData = this.getValidData();
      if (rawData.length > 0) {
        return _.map(rawData, function(datum) {
          return [
            datum.location.name.split(',')[0],
            datum.value
          ];
        });
      } else {
        return [];
      }
    },
    getValidData: function(region) {
      return _.map(
        _.filter(this.get("data"), function(datum) {
          if (region) {
            return datum.location.country_code == region;
          } else {
            return datum.location.name;
          }
        }), function(datum) {
          return _.extend({}, datum, {
            value: +datum.value
          });
        }
      );
    },
  }
));
