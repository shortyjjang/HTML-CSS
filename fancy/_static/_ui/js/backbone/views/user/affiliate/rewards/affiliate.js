FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Rewards = FancyBackbone.Views.User.Affiliate.Rewards || {};

FancyBackbone.Views.User.Affiliate.Rewards.AffiliateView = FancyBackbone.Views.Base.View.extend({
    template: FancyBackbone.Utils.loadTemplate("rewards_affiliate"),
    className: 'wrapper summary-affiliate',
    events: {
        'click .pagination .prev:not(.disabled)': 'onClickPrevButton',
        'click .pagination .next:not(.disabled)': 'onClickNextButton',
        'click .select-date li': 'onClickDate',
        'click .stit .download': 'onClickDownload',
    },
    initialize: function(options) {
        this._super();
        this.username = options.username;
        this.range = 7;

        this.affiliateView = new FancyBackbone.Views.User.Affiliate.Rewards.AffiliateDataView({
            username: this.username,
            range: this.range,
        });
        this.listenTo(this.affiliateView, 'changedData', this.onChangeAffiliateData);
    },
    onClickDate: function(e) {
        e.preventDefault();
        this.$el.find('.loading').show();

        var $currentTarget = $(e.currentTarget);
        var selectedDate = $currentTarget.attr('date-period');
        this.$el.find('.select-date').removeClass('opened');
        if (selectedDate == this.range) return;

        this.$el.find('.select-date .current').attr('date-period', selectedDate);
        this.$el.find('.select-date .current').text($currentTarget.text());
        this.range = selectedDate;

        this.affiliateView.onChangeRange(this.range);
        this.model = new FancyBackbone.Models.User.Affiliate.Rewards.AffiliateStat({
            username: this.username,
            range: this.range
        });
        var that = this;
        this.model.fetch().success(function(){
            that.renderStat();
        });
    },
    onClickDownload: function(e) {
        e.preventDefault();
        window.location.href = 'rewards/affiliate_download/' + this.range;
    },
    onClickPrevButton: function() {
        this.onChangePage(this.affiliateView.page-1);
    },
    onClickNextButton: function() {
        this.onChangePage(this.affiliateView.page+1);
    },
    onChangePage: function(page) {
        this.affiliateView.onChangePage(page);
        this.$el.find('.loading').show();
    },
    onChangeAffiliateData: function() {
        this.renderPagination();
        this.$el.find('.loading').hide();
    },
    renderPagination: function() {
        if (this.affiliateView.page == 1) {
            this.$el.find('.pagination .prev').addClass('disabled');
        } else {
            this.$el.find('.pagination .prev').removeClass('disabled');
        }

        if (this.affiliateView.collection.length > 10) {
            this.$el.find('.pagination .next').removeClass('disabled');
        } else {
            this.$el.find('.pagination .next').addClass('disabled');
        }
    },
    renderStat: function() {
        this.$el.find('.total > b').text(this.model.attributes.total_affiliates);
        this.$el.find('.total-earned .commission').text(numeral(this.model.attributes.total_commission).format("$0,0.00"));
        this.$el.find('.loading').hide();
    },
    render: function() {
        this.$el.find('.loading').show();
        this._super();

        this.model = new FancyBackbone.Models.User.Affiliate.Rewards.AffiliateStat({
            username: this.username,
            range: this.range
        });
        this.$el.html(this.template(this.model.attributes));

        var that = this;
        this.model.fetch().success(function(){
            that.renderStat();
        });
        
        this.$el.find("table.total-earned").before(this.affiliateView.render().$el);
        return this;
    },
});