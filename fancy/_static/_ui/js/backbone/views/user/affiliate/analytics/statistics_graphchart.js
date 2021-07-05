FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.StatisticsGraphChart = Backbone.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_statistics_graphchart"),
    initialize: function(options) {
        this.collection = new FancyBackbone.Collections.User.Affiliate.Analytics.StatisticsGraphChart({
            username: options.username,
            range: options.range,
            log_type: options.log_type,
        });
    },
    _renderChart: function(){
        data = this.collection.getData();
        var margin = {top: 20, right: 20, bottom: 30, left: 35};
        var width = $(".chart svg").width() - margin.left - margin.right;
        var height = $(".chart svg").height() - margin.top - margin.bottom;

        var values = _.pluck(data, "value");
        var dates = _.pluck(data, "date");

        var xScale = d3.time.scale().domain(
            [
                moment(_.min(dates)).subtract("hours", 1).toDate(),
                moment(_.max(dates)).add("hours", 1).toDate(),
            ]
        ).range(
            [20, width - 20]
        );


        var yScale = d3.scale.linear().domain(
            [0, Math.ceil(_.max(values) * 1.1)]
        ).range([height, 0]).nice();

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickSize(0)
            .tickFormat(d3.time.format('%m/%d'))
            .ticks(data.length > 14 ? d3.time.weeks : d3.time.days, 1);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .tickSize(-width)
            .tickFormat(d3.format("d"))
            .ticks(4)
            .orient("left");

        var area = d3.svg.area()
            .interpolate("monotone")
            .x(function(d) { return xScale(d.date); })
            .y0(height)
            .y1(function(d) { return yScale(d.value); });

        var line = d3.svg.line()
              .interpolate("monotone")
              .x(function(d) { return xScale(d.date); })
              .y(function(d) { return yScale(d.value); });


        var svg = d3.select(".chart svg").attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", _.str.sprintf("translate(%f, %f)", margin.left, margin.top));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0, 0)")
            .call(yAxis);

        svg.append("clipPath")
            .attr("id", "clip")
                .append("rect")
                    .attr("width", width)
                    .attr("height", height);

        svg.append("g").attr("class", "blue");
        var svg_chart = d3.select(".chart svg g." + "blue");

        svg_chart.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("clip-path", "url(#clip)")
            .attr("d", area);

        svg_chart.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("clip-path", "url(#clip)")
            .attr("d", line);

        var that = this;
        svg_chart.append("g")
            .attr("class", "circles")
            .selectAll("circle")
                .data(data)
                .enter().append("circle")
                    .attr("cx", function(d){ return xScale(d.date); })
                    .attr("cy", function(d){ return yScale(d.value); })
                    .attr("date", function(d){ return moment(d.date).format("YYYY/MM/DD"); })
                    .attr("r", 3)
                    .on("mouseenter", function(d) {
                        var $circle = $(this);
                        var left = xScale(d.date) + margin.left;
                        
                        var $tooltip = that.$el.find(".tooltip");
                        $tooltip.find(".value").text(d.value);
                        $tooltip.show().css({
                          left: left +11+ 'px',
                          top: $circle.attr('cy') - 15 + 'px',
                          'margin-left': -$tooltip.outerWidth() + 'px'
                        });
                        $circle.attr('r','4');
                    })
                    .on("mouseleave", function(d) {
                        $(this).attr('r','3');
                        that.$el.find(".tooltip").hide();
                    });
    },
    renderChart: function(params) {
        var that = this;
        this.collection.fetch({
            data: params
        }).success(function(){
            that._renderChart();
        });
    },
    render: function(summaryData) {
        this.$el.html(this.template(summaryData));
        this.renderChart();
        return this;
    },
    renderTotal: function(summaryData) {
        this.$el.find('p').html(this.template(summaryData));
    },
    removeChart: function() {
        this.$el.find('.chart svg').html('');
    },
    onChangeType: function(log_type, params) {
        this.collection.log_type = log_type;
        this.removeChart();
        this.renderChart(params);
    },
    onChangeRange: function(range, params) {
        this.collection.range = range;
        this.removeChart();
        this.renderChart(params);
    },
});