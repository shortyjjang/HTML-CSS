FancyBackbone.Mixins.DateRangeMixin = _.extend({}, FancyBackbone.Mixins.FormatURLMixin, {
  // urlParams: function() {
  //   // need to be implemented!
  // },
  urlFormat: function() {
    var range = this.getRange();
    if (range == 'specific') {
      return this.specificRangeURLFormat;
    } else {
      return this.presetURLFormat;
    }
  },
  urlParams: function() {
    var range = this.getRange();
    var ret = [
      this.getUserId(),
      range
    ];
    if (range == 'specific') {
      var dateRange = this.getDateRange();
      ret.push(dateRange[0].format("YYYYMMDD"));
      ret.push(dateRange[1].format("YYYYMMDD"));
    }
    return ret;
  },
});

FancyBackbone.Mixins.DateRangeModelMixin = _.extend({}, FancyBackbone.Mixins.DateRangeMixin, {
  getRange: function() {
    return this.get('range');
  },
  getUserId: function() {
    return this.get('user').id;
  },
  getDateRange: function() {
    return [
      moment.utc(this.get('date_from_str'), "YYYY-MM-DD"),
      moment.utc(this.get('date_to_str'), "YYYY-MM-DD"),
    ];
  },
});

FancyBackbone.Mixins.DateRangeCollectionMixin = _.extend({}, FancyBackbone.Mixins.DateRangeMixin, {
  getRange: function() {
    return this.range;
  },
  getDateRange: function() {
    return [
      moment.utc(this.dateFrom, "YYYY-MM-DD"),
      moment.utc(this.dateTo, "YYYY-MM-DD"),
    ];
  },
  getUserId: function() {
    return this.user.id;
  },
});