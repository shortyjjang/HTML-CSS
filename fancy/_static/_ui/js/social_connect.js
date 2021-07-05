
var $social = null;

$(document).ready(function() {
    
    function start($this) {
	   var backend  = $this.data('backend');
       if(!backend) return;
       window.popup = window.open(null, '_blank', 'height=700,width=700,left=250,top=100,resizable=yes,location=no,menubar=no', true);
	   var auth_url = "/social/auth_dialog/" + backend + '/';
	   popup.location.href = auth_url;
	   $social = $this;
	   authenticate();
    }
    $('a.social,button.social,button.switch._off').on('click', function(e) {
       e.preventDefault();
       start($(this));
    });

    $('.network .social .switch button').on('click',function(){
        var $parent = $(this).parents("div.after"), $current = $parent.find('button.current');

        if ($current.hasClass("btn-switchon")) {
            var backend = $current.data('backend');
            var unlink_url  = ['/social/unlink', backend].join('_') + '.json';
            if (confirm('Do you really want to remove ' + capitalize(backend) + ' connection?')) {
                $.post(unlink_url, {}, function(json){
                    var code = json.status_code;
                    if (code == 0) {
                        alert(json.message);
                    } else {
                        $parent.find(".btn-switchon").removeClass("current");
                        $parent.find(".btn-switchoff").addClass("current");
                        $parent.find(".after-off").show().end().find(".after-on").hide();
                    }
                }, "json");
            }
            return false;
        } else if ($current.hasClass("btn-switchoff")) {
            start($current);
        }

    });

    $('.unlink_social').on('click',function(){
    	var backend = $.trim($(this).data('backend'));
    	var $parent = $(this).parents("dd.social");
        if (!backend) return false;
	
        var type = backend;
        var unlink_url  = ['/social/unlink', type].join('_') + '.json';

        $.post(unlink_url, {}, function(json){
            var code = json.status_code;
            if (code == 0) {
                alert(json.message);
            } else {
                var $mobile = $parent;
                if ($mobile.length > 0) {
                    $mobile.empty().html('<em></em><button type="button" class="button btn-gray social '+backend+'" data-backend="'+backend+'" data-type="link">Connect with '+capitalize(backend) +'</button>');
                }
            }
        }, "json");
        return false;
    });


    $('.network-item button.switch.on').on('click',function(){
        var backend = $.trim($(this).data('backend'));
        
        var type = backend;
        if(!type) return;

        var unlink_url  = ['/social/unlink', type].join('_') + '.json';

        $.post(unlink_url, {}, function(json){
            var code = json.status_code;
            if (code == 0) {
                alert(json.message);
            } else {
                location.reload();
            }
        }, "json");
        return false;
    });
});

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function set_sns_signup_cookie() {
    var expire = new Date();
    expire.setDate(expire.getDate() - 1);
    document.cookie = 'ck_sns_su' + '=; path=/; expires='+expire.toUTCString();
}

function authenticate() {

    var authtype = $social.data('type');
    var backend  = $social.data('backend');
    var nextpath = $social.attr('next') || '/';
    var name     = 'ck_' + backend;

    var url = '/auth_' + backend + '.json'
    url = location.protocol == 'https:' ? '/social' + url : url;                                                                                                                                                                               

    if (!window.popup || !window.popup.closed) {
    	setTimeout(authenticate, 50);
    	return;
    }

    $.post(url, {}, function(json){

        if (!json.code) {
            alert("Sorry, we couldn't sign you in. Please try again.");
            return;
        }

        var signup_forced = ($.cookie.get('signup-forced')=='true');

        var params = {};
        if (authtype == 'signin') {
            url = '/check_login_' + backend + '.json';
            url = location.protocol == 'https:' ? '/social' + url : url;
            if (json.code) params['code'] = json.code;
            if (json.state) params['state'] = json.state;
            if (json.redirect_state) params['redirect_state'] = json.redirect_state;
            if (json.user) params['user'] = json.user;
            if (nextpath) params['next'] = nextpath;
            $.post(url, params, function(json){
                if (!json.status_code) {
                    alert(json.message);
                } else {
                    if (!json.url) {
                        try {track_event('Complete Login', {'channel':backend, 'forced':signup_forced}); } catch(e) {}
                    }
                    if((!signup_forced) && json.is_seller==1) {
                        location.href = '/merchant/dashboard';
                        return;
                    }

                    if(json.url && json.url.indexOf('/social/register/')==0) {
                        location.href = json.url+'?next='+encodeURIComponent(nextpath);
                        return;
                    } else {
                        location.href = nextpath;
                    }
                }
            });
        } else if (authtype == 'link') {
            var params   = json;
            if (nextpath) {
        	  params['next'] = nextpath;
            }
            var from_find_friends = (location.pathname == '/find_friends' || location.pathname == '/invite');
            params['origin'] = location.pathname;
            url = '/link_' + backend + '.json'
            url = location.protocol == 'https:' ? '/social' + url : url;

            if (from_find_friends) {
            	$('body').removeClass('wider').addClass('loading');
            	$('.waiting').show();
            	$('#searching-logo').addClass(backend)
            }

            $.post(url, params, function(json){
        		var code = json.status_code;
        		if (code == 0) {
        		    if (from_find_friends) {
        			$('body').addClass('wider').removeClass('loading');
        			$('.waiting').hide();
        			$('#searching-logo').removeClass('gplus')
        		    }
        		    alert(json.message);
        		} else {
        		    if (json.url)  {
        			     location.href = json.url;
        		    } else {
            			var name = json.name;
            			var $onoff = $('.network .social.' + backend);
            			if ($onoff.length > 0) {
            			    var html_str = 'Connected to ' + capitalize(backend) + ' as <b>'+name+'</b>';
            			    $onoff.find("div.after-on").html(html_str);
            			    $onoff.find(".switch button.btn-switchoff").removeClass("current");
            			    $onoff.find(".switch button.btn-switchon").addClass("current");
            			    $onoff.find(".after-on").show().end().find(".after-off").hide();
            			}
            			var $parent = $social.parents("dd.social");
            			var $mobile = $parent;
            			if ($mobile.length > 0) {
            			    var html_str = '<em class="on"></em><b>Linked with ' + capitalize(backend) +' as ' + name + '</b>  <a href="#" class="unlink_social" data-backend="'+backend+'">Unlink</a>';
            			    $mobile.empty().html(html_str);
            			}

                        var $parent = $social.parents("p.network-item");                        
                        if ($parent.length > 0) {
                            var html_str = 'Connected to ' + capitalize(backend) +' as ' + name;
                            $parent.find("> small").html(html_str);
                            $parent.find(".switch").toggleClass("on _off");
                        }
        		    }
        		}
            }).fail(function(xhr) {
                if(xhr.status==403) {
                    alert("It looks like your browser is set to block cookies. Please enable cookies in your browser settings.");
                } else if(xhr.status>=400) {
                    alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                }
            });
        }
    });
}
