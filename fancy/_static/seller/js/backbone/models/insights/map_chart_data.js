FancyBackbone.Models.Insights = FancyBackbone.Models.Insights || {};
FancyBackbone.Collections.Insights = FancyBackbone.Collections.Insights || {};

FancyBackbone.Models.Insights.MapChartData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin,
  {
    specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/map-chart-data/%s/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/seller/%s/dashboard/map-chart-data/%s/%s",
    urlParams: function() {
      var range = this.get('range');
      var ret = [
        this.get('user').id,
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
    getBubbleDataByCountry: function() {
      var rawData = this.getValidData();
      if (rawData.length > 0) {
        var ret = {};
        _.each(rawData, function(datum){
          var key = datum.location.country + '|' + datum.location.country_code;
          if (ret[key])
            ret[key] += datum.value;
          else
            ret[key] = datum.value;
        });
        return _.map(ret, function(v, k) {
          var splitedKey = k.split('|');
          return [ splitedKey[0], splitedKey[1], v ];
        });
      } else {
        return [];
      }
    },
    getBubbleDataByState: function() {
      var rawData = this.getValidData();
      if (rawData.length > 0) {
        var ret = {};
        _.each(rawData, function(datum){
          if (datum.location.country_code == 'US') {
            var state = datum.location.city.split('-')[0];
            if (ret[state])
              ret[state] += datum.value;
            else
              ret[state] = datum.value;
          }
        });
        return _.map(ret, function(v, k) {
          return [ k === '' ? 'United States' : k + ', United States', k, v ];
        });
      } else {
        return [];
      }
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
