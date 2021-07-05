FancyBackbone.Models.User = FancyBackbone.Models.User || {};
FancyBackbone.Models.User.Affiliate = FancyBackbone.Models.User.Affiliate || {};
FancyBackbone.Models.User.Affiliate.Analytics = FancyBackbone.Models.User.Affiliate.Analytics || {};
FancyBackbone.Collections.User = FancyBackbone.Collections.User || {};
FancyBackbone.Collections.User.Affiliate = FancyBackbone.Collections.User.Affiliate || {};
FancyBackbone.Collections.User.Affiliate.Analytics = FancyBackbone.Collections.User.Affiliate.Analytics || {};

FancyBackbone.Models.User.Affiliate.Analytics.AreaChartData = Backbone.RelationalModel.extend(_.extend(
  {},
  FancyBackbone.Mixins.DateRangeModelMixin, {
    //specificRangeURLFormat: "/rest-api/v1/seller/%s/dashboard/area-chart-data/%s/%s/%s/%s",
    //presetURLFormat: "/rest-api/v1/seller/%s/dashboard/area-chart-data/%s/%s",
    specificRangeURLFormat: "/rest-api/v1/affiliate/dashboard/area-chart-data/%s/%s/%s/%s",
    presetURLFormat: "/rest-api/v1/affiliate/dashboard/area-chart-data/%s/%s",
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
    getValidData: function(unit, dataKey) {
      return _.map(
        this.getAverageData(unit, dataKey), function(datum) {
          return _.extend({}, datum, {
            value: +datum.value,
            date: new Date(moment.utc(datum.date).format("L")),
          });
        }
      );
    },
    getAverageData: function(unit, dataKey) {
      var data;
      var isMontly = false;
      if (unit == 'month') {
        data = this.getMonthlyData(this.get(dataKey));
        isMontly = true;
      } else if (unit == 'week') {
        data = this.getWeeklyData(this.get(dataKey));
      } else if (unit == 'day') {
        return this.get(dataKey);
      } else {
        if (this.getLength() >= 350) {
          data = this.getMonthlyData(this.get(dataKey));
          isMontly = true;
        } else if (this.getLength() >= 100) {
          data = this.getWeeklyData(this.get(dataKey));
        } else {
          return this.get(dataKey);
        }
      }
      
      return _.map(data, function(v, k){
        return {
          value: v,
          date: isMontly ? moment(k + '/01').format('YYYY-MM-DDTHH:mm:ss') : moment(k).format('YYYY-MM-DDTHH:mm:ss')
        };
      });
    },
    getLength: function() {
      return this.get("data").length;
    },
    getMonthlyData: function(data) {
      var monthlyData = {};
      _.each(data, function(d) {
        var date = moment(d.date).format("YYYY/MM");
        if (monthlyData[date] === undefined) {
          monthlyData[date] = 0;
        }
        monthlyData[date] += parseFloat(d.value, 10);
      });
      return monthlyData;
    },
    getWeeklyData: function(data) {
      var iter = 0;
      var weeklyData = {};
      while (iter < data.length) {
        var sum = _.reduce(_.pluck(data.slice(iter, iter+7), 'value'), function(sum, value) { return sum + value; }, 0);
        weeklyData[data[iter].date] = sum;
        iter += 7;
      }
      return weeklyData;
    }
  }
));

