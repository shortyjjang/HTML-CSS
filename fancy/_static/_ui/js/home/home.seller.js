
var Insights = {
  $el : $("#sidebar .wrapper.dashboard"),
  init: function(sellerId){
    this.sellerId = sellerId;
    this.unit = 'day';
    this.$el.find(".tab li a").click(this.onChangeLogType.bind(this));
    this.getToday();
    this.changeLogType('sales');
  },
  onChangeLogType: function(event) {
    event.preventDefault();
    this.$el.find(".revenue").find("svg").removeClass('show');
    var logType = $(event.target).attr('log-type');
    this.$el.find(".tab li a").removeClass("current");
    $(event.target).addClass('current');
    this.changeLogType(logType);
  },
  getToday: function(){
    var that = this;
    $.get('/rest-api/v1/seller/'+this.sellerId+'/dashboard/summary/7d', function(res){
      that.today = res.current_values;
      that.showToday();
    })
  },
  showToday: function(){
    var that = this;
    if(!this.today) return;
    if(this.logType=='sales'){
      that.$el.find(".revenue").find("label").text("Revenue this week");
      that.$el.find(".revenue b.count").text("$"+that.today.sales.toFixed(2));
    }else if(this.logType=='view'){
      that.$el.find(".revenue").find("label").text("Views this week");
      that.$el.find(".revenue b.count").text(that.today.view);
    }else if(this.logType=='fancyd'){
      that.$el.find(".revenue").find("label").text("Fancys this week");
      that.$el.find(".revenue b.count").text(that.today.fancyd);
    }else if(this.logType=='orders'){
      that.$el.find(".revenue").find("label").text("Orders this week");
      that.$el.find(".revenue b.count").text(that.today.orders);
    }

  },
  changeLogType: function(type){
    var that = this;
    this.logType = type;
    //that.$el.find(".revenue").find("svg").remove().end().append($('<svg class="line"></svg>'));
    $.get('/rest-api/v1/seller/'+this.sellerId+'/dashboard/area-chart-data/'+type+'/7d', function(res){
      that.data = res.data;
      that._renderLineChart();
      that.showToday();
      that.$el.removeClass("loading");
      that.$el.find(".revenue").find("svg").addClass('show');
    })
  },
  getAxisValueLabel: function(value) {
    return numeral(value).format(
      this.logType == 'sales' ? "$0,0" : "0,0"
    );
  },
  createChart: function(selector, margin) {
    var chart = d3.select(".revenue " + selector+ ' g.chart');
    if(chart[0][0]) return chart;

    this.$el.find(".revenue").find("svg").remove().end().append($('<svg class="line"></svg>'));
    var chart = d3.select(".revenue " + selector)
                .append("g")
                    .attr("class", "chart")
                    .attr(
                        "transform",
                        _.str.sprintf("translate(%f, %f)", 0, margin.top)
                    );
    
    return chart;
  },
  getValidData: function(unit) {
    return _.map(
      this.getAverageData(unit), function(datum) {
        return _.extend({}, datum, {
          value: +datum.value,
          date: new Date(moment.utc(datum.date).format("L")),
        });
      }
    );
  },
  getAverageData: function(unit) {
    var data;
    return this.data;
    
    return _.map(data, function(v, k){
      return {
        value: v,
        date: moment(k).format('YYYY-MM-DDTHH:mm:ss')
      };
    });
  },
  getTooltipValueLabel: function(value) {
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
  _renderLineChart: function() {
    var chartData = this.getValidData(this.unit);
    if (chartData.length > 0) {
      
      var that = this;
      var values = _.pluck(chartData, "value");
      var margin = {
        top: 60,
        left: 14,
        bottom: 70,
        right: 14,
      };

      var width = this.$el.find(".revenue svg").width() - margin.left - margin.right;
      var height = this.$el.find(".revenue svg").height() - margin.top - margin.bottom;
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

      chartData.unshift({date:0, value:0});
      chartData.push({date:1, value:0});

      var area = d3.svg.area()
          .interpolate("linear")
          .x(function(d){
            if(d.date==0) return 0; if(d.date==1) return width+28; return xScale(d.date) + 14;
          })
          .y0(height + margin.bottom)
          .y1(function(d) {
            return yScale(d.value) ;
          });
      var line = d3.svg.line()
          .interpolate("linear")
          .x(function(d) { 
            if(d.date==0) return 0; if(d.date==1) return width+28; return xScale(d.date) + 14; 
          })
          .y(function(d) { 
            return yScale(d.value);
          });

      var chart = this.createChart('svg', margin);

      // Add the clip path.
      if(!chart.select('clipPath')[0][0]){
        chart
            .append("clipPath")
                .attr("id", "clip")
                    .append("rect")
                        .attr("width", width+28)
                        .attr("height", height + margin.bottom);
      }
      // Add the area path.
      if(!chart.select('.area')[0][0]){
        chart
            .append("path")
                .attr("class", "area current")
                .attr("clip-path", "url(#clip)")
      }
      chart.select('.area')
          .attr("d", area(chartData));


      // Add the line path.
      if(!chart.select('.line')[0][0]){
        chart
            .append("path")
                .attr("class", "line")
                .attr("id","currently")
                .attr("clip-path", "url(#clip)")
      }
      chart.select('.line')
          .attr("d", line(chartData));


      // Add circles
      if(!chart.select('.circles')[0][0]){
        chart
            .append("g")
              .attr("class", "circles")
      }

      var circles = chart.selectAll('circle');

      if(circles[0].length){
        circles.data(chartData);
        circles.attr('cy',  function(d){ 
                    return yScale(d.value);
                  })
      }else{
          chart
          .select('g.circles')
            .selectAll("circle")
                .data(chartData)
                .enter().append("circle")
                  .attr("cx", function(d){ 
                    return xScale(d.date) + 14; 
                  })
                  .attr("cy", function(d){ 
                    return yScale(d.value);
                  })
                  .attr("date", function(d){ return moment(d.date).format("YYYY/MM/DD"); })
                  .attr("r", 2.5)
                  .on("mouseenter", function(d) {
                    var $circle = $(this);
                    var $tooltip = that.$el.find(".tooltip");
                    $tooltip.text(
                      that.unit == 'month' ? moment(d.date).format('MMM, YYYY') : moment(d.date).format("YYYY/MM/DD")
                    );
                    $tooltip.addClass('line').css({
                      left: (xScale(d.date) + margin.left - ($('.tooltip').outerWidth()/2) + 5 ) + 'px',
                      top: ($circle.offset().top - $tooltip.outerHeight() - $('#header').height() - 30 )+ 'px',
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
      
    }
  },
}

/*Insights.init(window.sellerId);*/