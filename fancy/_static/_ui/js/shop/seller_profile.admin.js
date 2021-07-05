
var preventDefault = function (e) {
  if (e.which === 1) e.preventDefault();
}

$(function () {
    $("ul.merchant_options li > a").click(function(e) {
        e.preventDefault();
        var payload = { seller_id: $(this).attr('uid') };
        var name = $(this).attr('data-name');
        var label = $.trim($(this).closest('li').contents().eq(0).text());
        var value = !$(this).hasClass('on');
        payload[name] = value;
        if (confirm((value ? "Enable " : "Disable ") + label + "?")) {
            $.ajax({ type: 'post', url: '/admin/update-merchant-options.json', data: payload, dataType: 'json',
                success: function (json) {
                    // to do something?
                    if (json.status_code) {
                        location.reload();
                    } else {
                        alertify.alert(gettext("Failed. try again"));
                    }
                },
                error: function() {
                    alertify.alert(gettext("Failed. try again"));
                }
            });
        }
    });
});
