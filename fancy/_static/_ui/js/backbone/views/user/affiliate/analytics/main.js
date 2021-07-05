FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Analytics = FancyBackbone.Views.User.Affiliate.Analytics || {};

FancyBackbone.Views.User.Affiliate.Analytics.MainView = FancyBackbone.Views.Base.View.extend({
    template: FancyBackbone.Utils.loadTemplate("analytics_main"),
    events : {
        'click .select-date > a.current': 'onClickSelectDate',
        'click .select-date li': 'onClickDate',
        'click .select-date .trick': 'onClickSelectDate',
        'click #datepickers button.btn-update': 'onClickDateUpdate',
        'click #datepickers > .kalendae .k-active': 'onKalendaeDateClick',
    },
    initialize: function(options) {
        this._super();
        this.username = options.username;
        this.range = 7;

        this.staticsticsView = new FancyBackbone.Views.User.Affiliate.Analytics.StatisticsView({
            username: this.username,
            range: this.range,
        });
        this.productsView = new FancyBackbone.Views.User.Affiliate.Analytics.ProductsView({
            username: this.username,
            range: this.range,
        });
        this.listenTo(this.staticsticsView, 'changedStat', this.onChangedStat);
    },
    onChangedStat: function(e) {
        this.productsView.changeStat(e.stats);
    },
    onClickSelectDate: function(e) {
        e.preventDefault();
        this.$el.find('.select-date').toggleClass('opened');
        this.$el.find('#datepickers').hide();
    },
    onClickDate: function(e) {
        e.preventDefault();

        var $currentTarget = $(e.currentTarget);
        var selectedDate = $currentTarget.attr('date-period');
		if (selectedDate != 'specific')  $('.select-date').removeClass('opened');

		$currentTarget.closest('ul').find('a').removeClass('current').end().end().find('a').addClass('current');
        if (selectedDate == 'specific') {
            this.$el.find('#datepickers').show();
            return;
        }else{
            this.$el.find('#datepickers').hide();
		}
        if (selectedDate == this.range) return;

        $('.select-date .current').attr('date-period', selectedDate);
        $('.select-date .current').text($currentTarget.text());
        this.range = selectedDate;
        
        this.staticsticsView.onChangeRange(this.range);
        this.productsView.onChangeRange(this.range);
    },
    onClickDateUpdate: function(e) {
        var selectedDates = this.datepicker.getSelected().split(' - ');
        if (selectedDates.length < 2 || selectedDates[0] === selectedDates[1]) {
          alert("Please select two different dates.");
          return;
        }

        this.range = 'specific';
        this.$el.find('#datepickers').hide();
        this.$el.find('.select-date').removeClass('opened');

        this.dateFrom = moment.utc(selectedDates[0]);
        this.dateTo = moment.utc(selectedDates[1]);
        this.staticsticsView.onChangeRange(this.range, {
            dateFrom: this.dateFrom.format("YYYY/MM/DD"),
            dateTo: this.dateTo.format("YYYY/MM/DD"),
        });
        this.productsView.onChangeRange(this.range, {
            dateFrom: this.dateFrom.format("YYYY/MM/DD"),
            dateTo: this.dateTo.format("YYYY/MM/DD"),
        });
    },
    onKalendaeDateClick: function(event) {
        var selectedDates = this.datepicker.getSelected().split(' - ');

        if (!selectedDates.length) return;
        if (selectedDates.length == 1) {
            this.$el.find('.select-date > a').text(moment.utc(selectedDates[0]).format("ll"));
        } else {
            this.$el.find('.select-date > a').text(moment.utc(selectedDates[0]).format("ll") + ' - ' + moment.utc(selectedDates[1]).format("ll"));
        }
    },
    renderDatepickers: function() {
        var that = this;
        this.datepicker = new Kalendae(that.$el.find("#datepickers")[0], {
            months:1,
            mode:'range',
            viewStartDate: Kalendae.moment(),
            direction: 'past',
        });
    },
    render: function() {
        this._super();
        this.$el.html(this.template({todate: (new Date()).getDate()}));
        this.setSubview('statistics', this.staticsticsView.render().$el.appendTo(this.$('.statistics')));
        this.setSubview('products', this.productsView.render().$el.appendTo(this.$('.products')));
        this.setSubview('overall', new FancyBackbone.Views.User.Affiliate.Analytics.OverAllView({
            username: this.username,
            el: $('.overall')
        }).render().$el.appendTo(this.$('.overall')));
        this.renderDatepickers();
        return this;
    },
});