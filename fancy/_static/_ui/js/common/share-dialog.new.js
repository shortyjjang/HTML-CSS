// New Share Dialog
jQuery(function($){
	if ('home_v3' in location.args) return;

    $.fn.shareLayer = function(){
        var $this = $(this);
        $this
            .off('reset').on('reset', function(){
                $this
                .data({url:'',txt:'',img:''})
                .find('.frm')
                    .find('small').hide().end()
                    .find('.sns').show().end()
                .end()
				.find('.share-tab')
					.find('a').removeClass('current').end()
					.find('a:first-child').addClass('current').end()
				.end()
                .find('input:text').val('').removeClass('val').end()
                .find('textarea').val('').removeClass('val').end()
				.find('input[name="embed_fa"]').attr('checked','checked').end()
				.find('.btn_fa').show().end();
            })
            .off('open_thing').on('open_thing', function(){
                var $btn = $this.closest('.menu-container').find('button.share[tid]');
                if ($.isFunction($btn.data('updateAttrs'))) {
                    $btn.data('updateAttrs')();
                }
                $this.trigger('reset')
                var tid=$btn.attr('tid'), tuser, uname=$this.attr('uname'), ref='', url, tname, tdescription, img, iframe_h, thing_path, price, reacts, fancy_cnt;
                var login_require = $btn.attr('require_login');
                if (login_require && login_require=='true') {
                    $.dialog('popup.sign.signup').open();
                    return false;
                }

                // FIXME: duplicate logics
                function setAnywhere(img) {
                    var tag  = '<a href="' + $this.data('url') + '">';
                        tag += '<img src="' + img.src + '" class="fancy-id-' + tid + '" alt="' + tname + '"';
                    if (img.width != null && img.height != null) {
                        tag += ' width="' + img.width + '" height="' + img.height + '"';
                    }
                        tag += '></a>';

                    $this.find("[name='share-anywhere']").val(tag);
                }

                function setEmbed(img){
                    if(!img || !img.width || !img.height) return;

                    $this.find('.embed')
                        .data('ratio', img.height/img.width)
                        .find('.width_').val(img.width+32).attr('max', img.width+32).end()
                        .trigger('update');
                };

                function retrieveImgSize (imgRef) {
                    var _img = new Image();
                    _img.onload = function () {
                        imgRef.width = _img.width;
                        imgRef.height = _img.height;
                    };
                    _img.src = imgRef.src;
                }

                // FIXME: duplicate logics
                img = $btn.parent().prev('img').get(0);
                var imgRetrievalStrategies = [
                    function () {
                        var fig = $btn.closest('.figure-item').find('.figure[data-ori-url]');
                        img = fig.size() > 0 ? { src: fig.data('ori-url') } : null;
                        if (img) {
                            retrieveImgSize(img);
                        }
                    },
                    function () {
                        img = $btn.closest('.figure-item').find('.figure > img').get(0);
                    },
                    function () {
                        img = $('.fig-image > img').get(0);
                    },
                    function () {
                        img = $('#slideshow figure .img-wrap img').get(0);
                    }
                ];
                for (var i = 0; !img && i < imgRetrievalStrategies.length; i++) {
                    imgRetrievalStrategies[i]();
                }

                tuser = $btn.attr('tuser');
                if(!tuser) tuser = $btn.closest('.figure-item').find('.username a').text();

                price = $btn.attr('price');
                if(!price) price = $btn.closest('.figure-item').find('.price').text().replace(/[^\d\., ]+/g,'');
                price = $.trim(price);

                reacts = $btn.attr('reacts');
                if(!reacts){
                    reacts = $btn.closest('.figure-item').find('.figure-detail em').text().match(/\+ (\d+)/);
                    if(reacts) reacts = reacts[1];
                }

                $this.find('>ul.tab').nextUntil('button.ly-close').hide().end().find('li > a:first').click();

                thing_path = $btn.attr('turl') || ($btn.closest('a').attr('href')||'').replace(/^#.*$/, '');

                if(!thing_path) {
                    if(/^\/things\/\d+/.test(location.pathname)) {
                        thing_path = location.pathname;
                    } else {
                        thing_path = $btn.closest('div.figure-item').find('a.figure-img').attr('href');
                    }
                }

                if(uname) ref = '?ref='+uname;
                tdescription = $btn.attr("tdescription");
                fancy_cnt = $btn.attr("fancy_cnt");

                $this
                    .data({
                        url : url='http://'+location.host+thing_path+ref,
                        txt : tname=$btn.attr('tname'),
                        img : $btn.data('timage')
                    })
                    .attr({
                        otype : 'nt',
                        tid   : tid,
                        turl  : url,
                        tname : tname,
                        tdescription : tdescription,
                        ooid  : $btn.attr('uid')
                    })
                    .find('#share-link-input').val(url).end()
                    .find('.embed').trigger('update').end();

                if($this.data('prev') != 'thing-'+tid) $this.find('.thum>img').attr('src', '/_ui/images/common/blank.gif').attr('src', $btn.attr('timage'));
                $this.data('prev', 'thing-'+tid);

                // embed
                $this.find('.embed').find('input:checkbox').prop('checked',true).end()
                setEmbed(img);

                // fancy anywhere
                setAnywhere(img);

                $('<img style="position:absolute;left:-9999px;top:-9999px">')
                    .load(function(){ setEmbed(this); setAnywhere(this); $(this).remove() })
                    .attr('src', img.src)
                    .appendTo('body');

                // load short url for thing page
                $.ajax({
                    type : 'post',
                    url  : '/get_short_url.json',
                    data : {thing_id:tid},
                    dataType : 'json',
                    success  : function(json){
                        if(!json.short_url) return;
                        var enc_short_url = encodeURIComponent(json.short_url);
                        $this
                            .find('#share-link-input').val(json.short_url).end()
                            .find('.share-via a[href]').each(function(){ this.setAttribute('href', this.getAttribute('href').replace(/([\?&](?:u(?:rl)?|link))=[^&]+/, '$1='+enc_short_url)); }).end()
                            .data('url', json.short_url+ref);

                        setAnywhere(img);

                        $this.trigger('get_short_url', [$btn, json.short_url]);
                    }
                });

                // load short url for embed page
                $.ajax({
                    type : 'get',
                    url  : '/get_short_url.json',
                    data : {url:location.host+'/embed/v2/'+tid},
                    dataType : 'json',
                    success  : function(json){
                        if(!json.short_url) return;

                        $this.find('.embed').attr('short_url', json.short_url);
                        setEmbed(img);
                    }
                });

                $this.trigger('open');
            })
            .off('open').on('open', function(){
                var $this=$(this), url=$this.data('url'), txt=$this.data('txt'), img=$this.data('img'), amex=$this.data('amex'), enc_url, enc_txt, enc_img;

                enc_url = encodeURIComponent(url);
                enc_txt = encodeURIComponent(txt);
                enc_img = encodeURIComponent(img);

                if(amex) $this.data('amex', '');

                $this
                    .find('.sns .via')
                        .find('a.tw').attr('href', 'http://twitter.com/share?text='+(amex?encodeURIComponent(amex):enc_txt)+'&url='+enc_url+'&via=fancy').data({width:540,height:300}).end()
                        .find('a.fb').attr('href', 'http://www.facebook.com/sharer.php?u='+enc_url).data({url:url,text:txt}).end()
                        .find('a.gg').attr('href', 'https://plus.google.com/share?url='+enc_url).end()
                        .find('a.su').attr('href', 'http://www.stumbleupon.com/submit?url='+enc_url+'&title='+enc_txt).end()
                        .find('a.tb').attr('href', 'http://www.tumblr.com/share/link?url='+enc_url+'&name='+enc_txt+'&description='+enc_txt).end()
                        .find('a.li').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url='+enc_url+'&title='+enc_txt+'&source=thefancy.com').end()
                        .find('a.vk').attr('href', 'http://vkontakte.ru/share.php?url='+enc_url).end()
                        .find('a.wb').attr('href', 'http://service.weibo.com/share/share.php?url='+enc_url+'&appkey=&title='+enc_txt+(img?'&pic='+enc_img:'')).end()
                        .find('a.mx').attr('href', 'http://mixi.jp/share.pl?u='+enc_url+'&k=91966ce7669c34754b21555e4ae88eedce498bf0').data({width:632,height:456}).end()
                        .find('a.qz').attr('href', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+enc_url).end()
                        .find('a.re').attr('href', 'http://share.renren.com/share/buttonshare.do?link='+enc_url+'&title='+enc_txt).end()
                        .find('a.od').attr('href', 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=2&st.noresize=on&st._surl='+enc_url).end()
                    .end();

                $this.closest('.buttons').find('.menu-container').removeClass('opened').find('.show_share').show();
            })
            .off('close').on('close', function(){
                var $this=$(this)
                $this.find('small.email > input').val('').removeClass("error");
                $this.closest('.buttons').find('.menu-container').removeClass('opened').find('.show_share').hide().closest('li').removeClass('active');
            })
            .delegate('.sns .via a[href]:not(.fb,.gg,.more)', 'click', function(event){
                var $this = $(this);

                event.preventDefault();

                var w = $this.data('width') || 620, h = $this.data('height') || 380, t = Math.max(Math.round((screen.availHeight-h-80)/2), 20), l = Math.max(Math.round((screen.availWidth-w)/2), 5);
                try{ window.open($this.attr('href'), $this.attr('class'), 'top='+t+',left='+l+',width='+w+',height='+h+',menubar=no,status=no,toobar=no,location=no,personalbar=no,scrollbars=no,resizable=yes').focus(); }catch(e){};
            })
            .delegate('.sns .via a.fb', 'click', function(event){
                var $this = $(this);
                event.preventDefault();
                var params = {
                    method: 'feed',
                    link: $this.closest('.popup').data('url')||$this.data('url'),
                    name: $this.data('text'),
                    caption: '',
                    description: ''
                };
                FB.ui(params, $.noop);
            })
            .find('.embed')
                .off('update').on('update', function(){
                    var $this=$(this), type='', types={}, tid=$this.attr('tid'), uname=$this.attr('uname'), html='', url, width, height, ratio=$this.data('ratio'), padding=32;

                    // update sample
                    $this.find('input:checkbox').each(function(){
                        var id = this.name.replace(/^embed-/,''), $el = $this.find('.'+id), key = this.getAttribute('key');
                        $el.css('display', this.checked ? 'block':'');
                        if(this.checked) {
                            type += (type?',':'')+key;
                            types[key] = true;
                        }
                    });

                    ratio  = parseFloat(ratio);
                    width  = parseInt($this.find('.width_').val());
                    if(isNaN(width) || !ratio) {
                        $this.find('.height_').val('');
                    } else {
                        height = Math.round(ratio*(width-padding))+padding+15+6;

                        if(types.tt) height += 20;
                        if(types.pr || types.by) height += 18;

                        $this.find('.height_').val(height);
                    }

                    url = $this.attr('short_url');
                    if(!url) url = 'http://'+location.hostname+'/embed/v2/'+tid;
                    if(uname) url += '?ref='+uname;
                    url += (url.indexOf('?')<0?'?':'&')+'type='+type;

                    if(width && height){
                        html = '<iframe src="'+url+'" width="'+width+'" height="'+height+'" allowtransparency="true" frameborder="0" style="width:'+width+'px;height:'+height+'px;margin:0 auto;border:0"></iframe>';
                    }

                    $('#share-embed-input').val(html);
                })
            .end()
            .delegate('.email .text', 'blur', function(event){
            	if ($(this).val() != '' || $(this).val() ===$(this).attr('placeholder')) {
					$(this).addClass('val').removeClass('placeholder');
				}
            })
            .delegate('.email .text', 'keypress', function(event){
				$(this).removeClass('placeholder');
			})
            .delegate('.email input:text', 'keyup', function(event){
                var $this = $(this);
                var email = $this.val();
                if(!emailRegEx.test(email)) { // see common/util.js to change emailRegEx
                    $this.closest(".email").find(".btn-send").attr('disabled','disabled');
                }else{
                    $this.closest(".email").find(".btn-send").removeAttr('disabled');
                }
            })
            .delegate('.btn-send, .btn-share', 'click', function(event){
                event.preventDefault();
                var $this = $(this), $fancy_share = $this.closest("em.show_share"), params, emails=[], users=[], endpoint, otype = $fancy_share.attr('otype');

                $this.disable();

                if (otype == "gc") {
                    params = {
                        type : 'gc',
                        url  : $fancy_share.attr('gcurl'),
                        name : $fancy_share.attr('gcname'),
                        oid  : $fancy_share.attr('gcid'),
                        message :$.trim( $fancy_share.find('textarea').val())
                    };
                    endpoint = "/share-with-someone-gift.json"
                } else {
                    params = {
                        type : 'nt',
                        url  : $fancy_share.attr('turl'),
                        name : $fancy_share.attr('tname'),
                        oid  : $fancy_share.attr('tid'),
                        ooid : $fancy_share.attr('ooid'),
                        message :$.trim( $fancy_share.find('.email textarea').val())
                    };
                    endpoint = "/share-with-someone.json";
                }

                var email = $fancy_share.find('small.email > input').val();
                if(!emailRegEx.test(email)) { // see common/util.js to change emailRegEx
                    $fancy_share.find("small.email > input").addClass("error");
                    $this.disable(false);
                    return false;
                }

                emails.push(email);

                params.emails = emails.join(',');
                params.users  = users.join(',');

                $.ajax({
                    type : 'post',
                    url  : endpoint,
                    data : params,
                    dataType : 'json',
                    success  : function(json){
                        if(!json) return;
                        if(json.status_code) {
                            $this.trigger('close');
                            alertify.alert('Sent!');
                        } else {
                            alertify.alert(json.message);
                        }
                    },
                    complete : function(){
                        $this.disable(false);
                    }
                });
            })
        return $this;
    };

    $('#content')
        .delegate('button.share', 'click', function(event){
             $(this).closest('.buttons').find('.menu-container').removeClass('opened').find('.show_share').shareLayer().trigger('open_thing');
        })
});