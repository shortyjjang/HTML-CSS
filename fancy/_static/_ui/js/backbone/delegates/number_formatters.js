FancyBackbone.Delegates.NumberFormatters = {
    integer: function (value) {
        return numeral(value).format("0,0");
    },
    price: function (value, decimal) {
        decimal = decimal || 2;
        var format = "$0,0." + new Array(decimal + 1).join("0");
        return numeral(value).format(format);
    },
    float: function (value, decimal) {
        decimal = decimal || 2;
        var format = "0,0." + new Array(decimal + 1).join("0");
        return numeral(value).format(format);
    },
    format: function (format, value) {
        return _.str.sprintf(format, Number(value));
    }
};