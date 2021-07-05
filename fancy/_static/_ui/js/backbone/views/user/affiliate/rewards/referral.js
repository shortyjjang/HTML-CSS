FancyBackbone.Views.User = FancyBackbone.Views.User || {};
FancyBackbone.Views.User.Affiliate = FancyBackbone.Views.User.Affiliate || {};
FancyBackbone.Views.User.Affiliate.Rewards = FancyBackbone.Views.User.Affiliate.Rewards || {};

FancyBackbone.Views.User.Affiliate.Rewards.ReferralView = FancyBackbone.Views.Base.View.extend({
    template: FancyBackbone.Utils.loadTemplate("rewards_referral"),
    className: 'wrapper summary-referral',
    events: {
        'click .select-date li': 'onClickDate',
        'click .invite-notify button': 'onClickInviteButton',
        'click .stit .download': 'onClickDownload',
    },
    initialize: function(options) {
        this._super();
        this.username = options.username;
        this.range = 7;

        this.referralView = new FancyBackbone.Views.User.Affiliate.Rewards.ReferralDataView({
            username: this.username,
            range: this.range,
        });
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

        this.referralView.onChangeRange(this.range);
        this.model = new FancyBackbone.Models.User.Affiliate.Rewards.ReferralStat({
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
        window.location.href = 'rewards/referral_download/' + this.range;
    },
    onClickInviteButton: function(){
        window.location.href='/invite';
    },
    renderStat: function() {
        this.$el.find('.total > b').text(this.model.attributes.total_people);
        this.$el.find('.total-earned .commission').text(numeral(this.model.attributes.total_commission).format("$0,0.00"));
        this.$el.find('.loading').hide();
    },
    render: function() {
        this.$el.find('.loading').show();
        this._super();

        this.model = new FancyBackbone.Models.User.Affiliate.Rewards.ReferralStat({
            username: this.username,
            range: this.range
        });
        this.$el.html(this.template(this.model.attributes));

        var that = this;
        this.model.fetch().success(function(){
            that.renderStat();
        });
        
        this.$el.find("table.total-earned").before(this.referralView.render().$el);
        return this;
    },
    hide: function() {
        this.$el.hide();
    },
});