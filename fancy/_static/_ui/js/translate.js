jQuery(function($){
    ACCESS_TOKEN_URL = '/admin/ms_translator_token.json',
    TRANSLATE_URL    = location.protocol + '//api.microsofttranslator.com/V2/Ajax.svc/Translate';

    $('a.btn-translate').on('click', function(event){
        event.preventDefault();
        var $this = $(this), $span = $this.parent().children('.translate'), txt = $span.text();
        function onerror(){ $span.text(txt); alert(gettext('Translation failed.')); };
        $span.text(gettext('Translating...'));
        $.ajax({
            type : 'get',
            url  : ACCESS_TOKEN_URL,
            dataType : 'json',
            success  : function(json){
                var params = {to: window.lang, text:txt, contentType:'text/plain', appId:'Bearer '+json.access_token};
                $.ajax({
                    url  : TRANSLATE_URL,
                    data : params,
                    dataType : 'jsonp',
                    jsonp    : 'oncomplete',
                    success  : function(txt){
                        $span.text(txt);
                    },
                    error : onerror
                });
            },
            error : onerror
        });
        $this.closest('p').removeClass('on');
    });
})
