jQuery(function($) {
    $(document.body)
    .on('click', '.actions.in-overlay .share', function(){
        $(this).closest('.actions').toggleClass('opened')
    }).on('mousedown', '.actions.in-overlay .share_link', function(){
        event.preventDefault();
        var $link = $(this);
        Gear.prepareClipboard(location.protocol + '//' + location.hostname + $link.attr('href')); // see common.js
    }).on('mouseup', '.actions.in-overlay .share_link', function(){
        event.preventDefault();
        Gear.copyToClipboard(); // see common.js
    }).on('click', '.actions.in-overlay .share_link', function(){
        event.preventDefault();
        var $link = $(this);
        var msg = $(this).next('.msg').show()
        setTimeout(function() {msg.hide()},500)
    })
})
