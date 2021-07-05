// Share dialogs and buttons
jQuery(function($){
    $('#content,#sidebar,#summary,#header_summary,#chat-timer,#livechat-stream,.popup.livechat')
        // .delegate('.timeline .btn-share,.figure-item .btn-share, #show-someone', 'click', function(event){
        //     event.preventDefault();
        //     $fancy_share.trigger('open_thing', this);
        // })
        .delegate('.btn-list-share-popover', 'click', function(event){
            event.preventDefault();
            if (window.renderMoreShare) {
                window.renderMoreShare({
                    componentClass: 'share-container', 
                    btnClass: 'btn-share-popover',
                    renderMode: 'Button'
                });
            }
        })
        .delegate('.btn-user-share-popover', 'click', function(event){
            event.preventDefault();
            if (window.renderMoreShare) {
                window.renderMoreShare({
                    componentClass: 'share-container', 
                    btnClass: 'btn-share-popover',
                    renderMode: 'Button'
                });
            }
        })
        .delegate('.btn-seller-share-popover', 'click', function(event){
            event.preventDefault();
            if (window.renderMoreShare) {
                window.renderMoreShare({
                    componentClass: 'share-container', 
                    btnClass: 'btn-share-popover',
                    renderMode: 'Button'
                });
            }
        });
});
