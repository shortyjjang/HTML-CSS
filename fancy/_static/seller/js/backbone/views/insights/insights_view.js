FancyBackbone.Views.Insights = FancyBackbone.Views.Insights || {};

FancyBackbone.Views.Insights.ControllerView = Backbone.View.extend({
  template: FancyBackbone.Utils.loadTemplate("insights_controller_view"),
  events: {
    'click .date_': 'onRangeButtonClick',
    'click #datepickers > .kalendae .k-active': 'onDateClick',
    'click #datepickers > .kalendae .k-today': 'onDateClick',
  },
  initialize: function(options) {
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.chartType = options.chartType;
    this.logType = options.logType;
    this.sellerId = options.sellerId;
  },
  getQueryString: function() {
    var params = {
      range: this.range,
      log_type: this.logType,
      chart_type: this.chartType,
    };
    if (this.range == 'specific') {
      params.date_from = this.dateFrom.format("YYYY/MM/DD");
      params.date_to = this.dateTo.format("YYYY/MM/DD");
    }
    if (this.sellerId) {
      params.seller_id = this.sellerId;
    }
    return $.param(params);
  },
  onDateClick: function(event) {
    var selectedDates = this.datepicker.getSelected().split(' - ');

    if (!selectedDates.length) return;
    if (selectedDates.length == 1) {
      this.$el.find('.date_detail .start-date input').val(moment.utc(selectedDates[0]).format("ll"));
      this.$el.find('.date_detail .end-date input').val('');
    } else {
      this.$el.find('.date_detail .start-date input').val(moment.utc(selectedDates[0]).format("ll"));
      this.$el.find('.date_detail .end-date input').val(moment.utc(selectedDates[1]).format("ll"));
      this.$el.find(".date-range").text(moment.utc(selectedDates[0]).format("ll") + ' - ' + moment.utc(selectedDates[1]).format("ll"));

      this.range = "specific";
      this.dateFrom = moment.utc(selectedDates[0]);
      this.dateTo = moment.utc(selectedDates[1]);
      var href = location.pathname + "?" + this.getQueryString();
      window.router.navigate(href, {trigger: true});
    }
  },
  onRangeButtonClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    this.$el.find("a.date_").removeClass("current");
    $currentTarget.addClass("current");

    this.range = $currentTarget.attr("range");
    if ($currentTarget.is(".specific")) {
      this.$el.find(".date_detail").show();
    } else {
      this.$el.find(".date-range").text($currentTarget.text());
      this.$el.find(".date_detail").hide();
      var href = location.pathname + "?" + this.getQueryString();
      window.router.navigate(href, {trigger: true});
    }
  },
  setChartType: function(chartType) {
    this.chartType = chartType;
  },
  setLogType: function(logType) {
    this.logType = logType;
  },
  renderDatepickers: function() {
    var that = this;
    this.datepicker = new Kalendae(that.$el.find("#datepickers")[0], {
      months:1,
      mode:'range',
      direction: 'today-past',
      blackout: function(date) {
        return Kalendae.moment(date) < Kalendae.moment('2/13/2012');
      },
      viewStartDate: Kalendae.moment(),
    });
  },
  render: function() {
    this.$el.html(this.template(
      this.model.attributes
    ));
    this.renderDatepickers();
    return this;
  },
});

FancyBackbone.Views.Insights.BaseChartView = Backbone.View.extend({
  className: "data loading",
  template: FancyBackbone.Utils.loadTemplate('insights_chart_view'),
  events: {
    'click .type li > a': 'onChangeLogType',
    'click .viewer li > a[chart-type]': 'onChangeChartType',
    'mouseleave .chart': 'onMouseleaveFromChart',
  },
  initialize: function(options) {
    this.summary = options.summary;
    this.range = options.range;
    this.dateFrom = options.dateFrom;
    this.dateTo = options.dateTo;
    this.chartType = options.chartType;
    this.logType = options.logType;
    this.sellerId = options.sellerId;
    this.chartData = new this.chartDataClass({
      user: window.seller,
      range: options.range,
      date_from_str: options.dateFrom ? options.dateFrom.format("YYYY/MM/DD") : "",
      date_to_str: options.dateTo ? options.dateTo.format("YYYY/MM/DD") : "",
      log_type: options.logType,
    });
    this.chartDataDfd = this.chartData.fetch();
  },
  onMouseleaveFromChart: function(event) {
    event.preventDefault();
    this.$el.find('.tooltip').hide();
  },
  onChangeChartType: function(event) {
    event.preventDefault();
    this.$el.addClass("loading");

    var chartType = $(event.currentTarget).attr('chart-type');
    this.chartType = chartType;
    var href = location.pathname + "?" + this.getQueryString();
    this.trigger('changedChartType', {
        chartType: chartType,
        href: href
    });
  },
  onChangeLogType: function(event) {
    event.preventDefault();
    this.$el.addClass("loading");

    var logType = $(event.currentTarget).attr('log-type');
    this.logType = logType;
    var href = location.pathname + "?" + this.getQueryString();
    this.trigger('changedLogType', {
        logType: logType,
        href: href
    });
  },
  getQueryString: function() {
    var params = {
      range: this.range,
      log_type: this.logType,
      chart_type: this.chartType,
    };
    if (this.range == 'specific') {
      params.date_from = this.dateFrom.format("YYYY/MM/DD");
      params.date_to = this.dateTo.format("YYYY/MM/DD");
    }
    if (this.sellerId) {
      params.seller_id = this.sellerId;
    }
    return $.param(params);
  },
  renderChart: function() { },
  render: function(option) {
    this.$el.html(this.template({
      chartType: this.chartType,
      logType: this.logType,
      option: typeof option === 'undefined' ? true : option,
      diff: this.summary.getDiff(),
      summary: this.summary.attributes,
      dateFrom: this.dateFrom && this.dateFrom.format("YYYYMMDD") || '',
      dateTo: this.dateTo && this.dateTo.format("YYYYMMDD") || '',
      range: this.range,
      user: window.user,
    }));
    var that = this;
    _.defer(function() {
      that.renderChart();
    });
    return this;
  },
});


FancyBackbone.Views.Insights.MapChartView = FancyBackbone.Views.Insights.BaseChartView.extend({
  chartDataClass: FancyBackbone.Models.Insights.MapChartData,
  events: {
    'click .type li > a': 'onChangeLogType',
    'click .viewer li > a': 'onChangeChartType',
    'click button.btn-close': 'onClickCloseButton',
  },
  onClickCloseButton: function(event) {
    this.$el.find("button.btn-close").hide();
    this.renderChart();
  },
  getValueLabel: function(value) {
    if (this.logType == 'sales') {
      return numeral(value).format("$0,0.00");
    } else {
      var formattedValue = numeral(value).format("0,0");
      if (this.logType == 'view') {
        return formattedValue + " " + (value > 1 ? "Clicks" : "Click");
      } else if (this.logType == 'fancyd') {
        return formattedValue + " " + "Fancy'd";
      } else if (this.logType == 'impressions') {
        return formattedValue + " " + "Impressions";
      } else { // orders
        return formattedValue + " " + (value > 1 ? "Orders" : "Order");
      }
    }
  },
  getTooltipData: function(country, value) {
    return "<span class='tooltip'><span class='country'>" + country + "</span>" + "<b class='value'>" + this.getValueLabel(value) + "</b></span>";
  },
  getMapData: function(region) {
    var data = this.getTableData(region);
    var that = this;
    return _.map(data, function(d) {
      return [d[1], d[2], that.getTooltipData(d[0], d[2])]; // d = ['country_name', 'country_code', 'value']
    });
  },
  getTableData: function(region) {
    var data;
    if (region) {
      data = this.chartData.getBubbleDataByState(region);
    }
    else {
      data = this.chartData.getBubbleDataByCountry();
    }
    data.sort(function(a,b) { return b[2] - a[2]; });
    return data;
  },
  renderWorldMap: function() {
    var mapData = this.getMapData();
    mapData.unshift(['Country', 'Count', {'role': 'tooltip', 'p': {'html': true}}]);

    this.chart.draw(google.visualization.arrayToDataTable(mapData), {
      displayMode: 'regions',
      colorAxis: {colors: ['#c4dcee', '#6396bd']},
      legend: 'none',
      width: 690,
      tooltip: {isHtml: true, showTitle: false},
    });

    if( mapData.length > 1 ){
      var min = mapData[mapData.length-1][1];
      var max = mapData[1][1];
      if( this.logType == 'sales' ) {
        min = numeral(min).format("0,0.00");
        max = numeral(max).format("0,0.00");
      } else {
        min = numeral(min).format("0,0");
        max = numeral(max).format("0,0");
      }
      this.$el.find('.map .detail').html(min + ' <span class="dash">~</span> ' + max);
    }
  },
  renderRegionMap: function(region) {
    if (region != 'US') return;
    this.$el.find("button.btn-close").show();
    var options = {
      displayMode: 'regions',
      colorAxis: {colors: ['#c4dcee', '#6396bd']},
      region: region,
      legend: 'none',
      width: 690,
      tooltip: {isHtml: true, showTitle: false},
    };
    var data = [];
    data = this.getMapData(region);
    data.unshift(['State', 'Count', {'role': 'tooltip', 'p': {'html': true}}]);
    options['resolution'] = 'provinces';

    this.chart.draw(google.visualization.arrayToDataTable(data), options);
  },
  renderChart: function() {
    var that = this;
    var renderMap = function() {
      that.chart = new google.visualization.GeoChart($(".chart .map .chart-content").get(0));
      that.renderWorldMap();

      google.visualization.events.addListener(that.chart, 'regionClick', function(eventData) {
        if (eventData.region.indexOf('US-') > -1) return;
        that.renderRegionMap(eventData.region);
      });
    };

    this.chartDataDfd.success(function() {
      google.load('visualization', '1', {'packages': ['geochart']});
      google.setOnLoadCallback(renderMap);
      that.$el.removeClass("loading");
    });
  },
});

FancyBackbone.Views.Insights.AreaChartView = FancyBackbone.Views.Insights.BaseChartView.extend({
  chartDataClass: FancyBackbone.Models.Insights.AreaChartData,
  getAxisValueLabel: function(value) {
    return numeral(value).format(
      this.logType == 'sales' ? "$0,0" : "0,0"
    );
  },
  getTooltipValueLabel: function(value) {
    if (this.logType == 'sales' || this.logType == 'sf_affiliate_sales_commission' || this.logType == 'sf_affiliate_sales_commission') {
      return numeral(value).format("$0,0.00");
    } else {
      var formattedValue = numeral(value).format("0,0");
      if (this.logType == 'view') {
        return formattedValue + " " + (value > 1 ? "Clicks" : "Click");
      } else if (this.logType == 'fancyd') {
        return formattedValue + " " + "Fancy'd";
      } else if (this.logType == 'impressions') {
        return formattedValue + " " + "Impressions";
      } else { // orders
        return formattedValue + " " + (value > 1 ? "Orders" : "Order");
      }
    }
  },
  setUnit: function(unit) {
    this.unit = unit;
    this.$el.find('.select-unit option:selected').removeAttr('selected');
    this.$el.find('.select-unit [unit-type="' + unit + '"]').attr('selected', 'selected');
  },
  getXAxis: function(xScale) {
    var xAxis = null;
    var dataLength = this.chartData.getLength();
    if ( dataLength < 350 && this.unit != 'month' ){
      xAxis= d3.svg.axis()
                      .scale(xScale)
                      .tickSize(0)
                      .tickFormat(d3.time.format('%d'))
                      .ticks(d3.time.days, Math.ceil(dataLength/30));
      this.setUnit(dataLength >= 50 || this.unit == 'week' ? 'week' : 'day');
    } else {
      xAxis = d3.svg.axis()
                      .scale(xScale)
                      .tickSize(0)
                      .tickFormat(d3.time.format('%m/%Y'))
                      .ticks(d3.time.months, Math.ceil(dataLength/350));
      if ( this.unit == 'month' || this.unit === null )
        this.setUnit('month');
    }
    return xAxis;
  },
  getYAxis: function(yScale, width, values) {
    return d3.svg.axis()
            .scale(yScale)
            .tickSize(-width)
            .ticks(_.max(values) < 4 ? Math.ceil(_.max(values)) : 4)
            .orient("left")
            .tickFormat(_.bind(this.getAxisValueLabel, this));
  },
  createChart: function(selector, xAxis, yAxis, margin, height) {
    var chart = d3.select(".chart .graph " + selector)
                .append("g")
                    .attr(
                        "transform",
                        _.str.sprintf("translate(%f, %f)", margin.left, margin.top)
                    );
    // Add the x-axis.
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 9) + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "middle");
    // Add the y-axis.
    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0, 0)")
        .call(yAxis);

    return chart;
  },
  _renderLineChart: function() {
    var chartData = this.chartData.getValidData(this.unit, 'data');
    if (chartData.length > 0) {
      var that = this;
      var values = _.pluck(chartData, "value");
      var valueLabelLength = this.getAxisValueLabel(_.max(values)).length;
      var margin = {
        top: 40,
        left: valueLabelLength * 6 + 10,
        bottom: 40,
        right: 15,
      };

      var width = this.$el.find(".chart svg").width() - margin.left - margin.right;
      var height = this.$el.find(".chart svg").height() - margin.top - margin.bottom;
      var dates = _.pluck(chartData, "date");
      var xScale = d3.time.scale().domain(
        [
          moment(_.min(dates)).subtract("hours", 1).toDate(),
          moment(_.max(dates)).add("hours", 1).toDate(),
        ]
      ).range(
        [0, width]
      );

      var yScale = d3.scale.linear().domain(
        [0, _.max(values)]
      ).range([height, 0]).nice();

      var area = d3.svg.area()
          .interpolate("linear")
          .x(function(d){
            return xScale(d.date);
          })
          .y0(height)
          .y1(function(d) {
            return yScale(d.value);
          });
      var line = d3.svg.line()
          .interpolate("linear")
          .x(function(d) { return xScale(d.date); })
          .y(function(d) { return yScale(d.value); });

      var xAxis = this.getXAxis(xScale);
      var yAxis = this.getYAxis(yScale, width, values);

      var chart = this.createChart('svg.line', xAxis, yAxis, margin, height);

      if (this.unit !== 'month') {
        var xAxis2 = d3.svg.axis()
                      .scale(xScale)
                      .tickSize(0)
                      .tickFormat(d3.time.format('%b'))
                      .ticks(d3.time.months, 1);
        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height + 9 + 15) + ")")
            .call(xAxis2)
          .selectAll("text")
            .style("text-anchor", "middle");
      }

      // Add the clip path.
      chart
          .append("clipPath")
              .attr("id", "clip")
                  .append("rect")
                      .attr("width", width)
                      .attr("height", height+20);
      // Add the area path.
      chart
          .append("path")
              .attr("class", "area current")
              .attr("clip-path", "url(#clip)")
              .attr("d", area(chartData));
      // Add the line path.
      chart
          .append("path")
              .attr("class", "line")
              .attr("id", "currently")
              .attr("clip-path", "url(#clip)")
              .attr("d", line(chartData));

      // Add circles
      chart
          .append("g")
            .attr("class", "circles")
            .selectAll("circle")
                .data(chartData)
                .enter().append("circle")
                  .attr("cx", function(d){ return xScale(d.date); })
                  .attr("cy", function(d){ return yScale(d.value); })
                  .attr("date", function(d){ return moment(d.date).format("YYYY/MM/DD"); })
                  .attr("r", 2.5)
                  .on("mouseenter", function(d) {
                    var $circle = $(this);
                    var $tooltip = that.$el.find(".tooltip");
                    $tooltip.find(".date").text(
                      that.unit == 'month' ? moment(d.date).format('MMM, YYYY') : moment(d.date).format("ll")
                    );
                    $tooltip.find(".value").text(
                      that.getTooltipValueLabel(d.value)
                    );
                    $tooltip.addClass('line').css({
                      left: (xScale(d.date) + margin.left - ($('.tooltip').outerWidth()/2) + 5 ) + 'px',
                      top: ($circle.offset().top - $tooltip.outerHeight() + 23 - 215 )+ 'px',
                      'margin-left': '0px'
                    }).addClass('ani').fadeIn();
                    $circle.attr('class', 'selected').attr('r','4');
                  })
                  .on("mouseleave", function(d) {
                    var $circle = $(this);
                    $circle.removeAttr('class').attr('r','2.5');
                    setTimeout(function(){
                      if (that.$el.find("circle.selected").length === 0 && that.$el.find(".tooltip").is(":visible")) {
                        that.$el.find(".tooltip").fadeOut();
                      }
                    }, 1500);
                  });
      
    }
  },
  renderChart: function() {
    var that = this;
    this.unit = null;

    this.$el.find('h3').html(this.$el.find('select').val());
    this.chartDataDfd.success(function() {
      that._renderLineChart();
      that.$el.removeClass("loading");
    });
  },
});

FancyBackbone.Views.Insights.BestSellerView = Backbone.View.extend({
  tagName: 'div',
  className: 'best-seller-view wrapper',
  template: FancyBackbone.Utils.loadTemplate('insights_best_seller_view'),
  saleItemTemplate: FancyBackbone.Utils.loadTemplate('insights_best_seller_item_view'),
  events: {
    'click th a[field]': 'onSortFieldClick',
    'click .btn-area button:not(.disabled)': 'onPageNavigateButtonClick',
    'click h3.stit': 'onClickOpenPopup',
    'click a.view': 'onClickOpenPopup',
  },
  reloadContents: function() {
    this.$el.find(".table").addClass("loading");
    var collectionDfd = this.collection.fetch({
      data: {
        'sort_field': this.sortField,
        'sort_dir': this.sortDir,
        'page': this.page,
      }
    });
    var that = this;
    collectionDfd.always(function() {
      that.render();
      this.$el.find(".table").removeClass("loading");
    });
  },
  onPageNavigateButtonClick: function(event) {
    var $currentTarget = $(event.currentTarget);
    if ($currentTarget.is(".btn-prev")) {
      this.page--;
    } else {
      this.page++;
    }
    this.reloadContents();
  },
  onSortFieldClick: function(event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    console.log($currentTarget);
    var newSortField = $currentTarget.attr('field');
    if (newSortField == this.sortField) {
      this.sortDir = this.sortDir == 'desc' ? 'asc' : 'desc';
    } else {
      this.sortField = newSortField;
      this.sortDir = 'desc';
    }
    this.page = 1;
    this.reloadContents();
  },
  onClickOpenPopup: function(event) {
    event.preventDefault();
    if( this.page === 1 && this.collection.models.length === 0) {
      return;
    }
    window.popups.bestSeller.render(this.collection);
  },
  initialize: function(options) {
    this.collection = options.collection;
    this.sortField = options.sortField;
    this.sortDir = options.sortDir;
    this.page = 1;
  },
  getDateRangeLabel: function() {
    var dateFrom = this.collection.dateFrom;
    var dateTo = this.collection.dateTo;
    if (dateTo.diff(dateFrom, 'days') == 0) {
      if (dateTo.diff(moment.utc(), 'days') == 0) {
        return gettext('Today');
      } else {
        return dateTo.format('ll');
      }
    } else {
      return _.str.sprintf("%s - %s", dateFrom.format("ll"), dateTo.format("ll"));
    }
  },
  render: function() {
    this.$el.find(".table").addClass("loading");
    var collectionDfd = this.collection.fetch({
      data: {
        'sort_field': this.sortField,
        'sort_dir': this.sortDir,
        'page': this.page,
      }
    });

    this.$el.html(this.template());

    var that = this;
    collectionDfd.always(function() {
      that._render();
      that.$el.find(".table").removeClass("loading");
    });
    return this;
  },
  _renderTitle: function() {
    this.$el.prepend(new FancyBackbone.Views.Insights.SubTitleView({
      sub_title: 'Best Sellers',
    }).render().$el);
  },
  _render: function() {
    this._renderTitle();
    if (this.page <= 1) {
      this.$el.find(".btn-area .btn-prev").addClass("disabled");
    }
    if (this.page >= this.collection.maxPage || !this.collection.maxPage) {
      this.$el.find(".btn-area .btn-next").addClass("disabled");
    }
    this.$el.find("a[field=" + this.sortField + "]").attr('class', this.sortDir);
    if( this.collection.models.length === 0) {
      this.$el.find("ul").append($("<li class='empty'>").html(gettext("No data is available.")));
      this.$el.find("a.view").hide();
    } else {
      this.$el.find(".stit").css('cursor', 'pointer');
      this._appendContents();
    }

    return this;
  },
  _appendContents: function() {
    _.each(this.collection.models, function(saleItem) {
      var $el = $("<li>");
      $el.html(this.saleItemTemplate(saleItem.toJSON()));
        if (this.$el.find("li.more").length === 0) {
          this.$el.find("ul").append($el);
        } else {
          this.$el.find("li.more").before($el);
        }
    }, this);
  },
});

FancyBackbone.Views.Insights.View = Backbone.View.extend({
  initialize: function() {
    this.contentView = new FancyBackbone.Views.Insights.ContentView();
  },
  updateView: function(sellerId, range, dateFrom, dateTo, chartType, logType) {
    this.contentView.updateView(sellerId, range, dateFrom, dateTo, chartType, logType);
  },
  render: function() {
    this._super();
    this.$el.prepend('<div class="controller"><h2 class="ptit embo"><a href="/merchant/dashboard">Dashboard</a> <span class="arrow">&gt;</span> <b>Insights</b></h2></div>');
    this.$el.find('.wrapper-content').append(this.contentView.render().$el);
    return this;
  },
});
