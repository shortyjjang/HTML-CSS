(function($){

var args = {}, hash, saving = false, isRetina = window.devicePixelRatio > 1, params = {};

if(/^#data:/.test(hash=location.hash)) args = unparam(location.hash.substr(6));
onData(args);

jQuery(function(){
	$('.back_').click(function(){ send({cmd:'reset'}) });
	$('.done').click(function(){ send({cmd:'close'}) });

	$(".category_, .list_")
		.click(function(e){

			e.preventDefault();

			if($(this).attr('require_login') == 'true'){
				send({cmd:'close'});
				window.open("/login?close");
				return;
			}

			var $lists = $(this).closest('div').find('.lists-popout');

			if($lists.is(":visible")){
				$lists.hide();
			}else{
				$(this)
					.closest('.frm').find(".lists-popout").hide().end().end()
					.closest('div').find('.lists-popout').show();	
			}
			
		})
	$(".category, .lists")
		.find(".trick")
			.click(function(e){
				e.preventDefault();
				$('.lists-popout').hide();
			})

	$(".lists-popout.category")
		.on('click', 'li', function(event){
			var $this = $(this), $label = $(this).find("label");
			$this.closest('.category:not(.lists-popout)').find('a.category_').removeClass('placeholder').text($label.text()).end();
			params.category = $label.data('value');
			$('.lists-popout').hide();
		});

	$(".lists-popout.lists")
		.on('click', 'li', function(event){
			var $this = $(this), $label = $(this).find("label");
			$this.closest('.lists:not(.lists-popout)').find('a.list_').removeClass('placeholder').text($label.text()).end();
			params.list_ids = $label.data('value');
			$('.lists-popout').hide();
		});

	$(".lists-popout.lists .search input:text")
		.on('keyup paste', function(){
			var $this = $(this), val = $this.val();
			$this.closest('.lists').find("ul").show().find("li").show().end().end().find(".result").hide();

			if(val){
				var $lists = $this.closest(".lists").find("ul li").each(function(){
					var $li = $(this);
					if($li.find("label").text().indexOf(val) == -1){
						$li.hide();
					}
				})
				if( $lists.filter(":visible").length == 0){
					$this.closest('.lists').find("ul").hide().end().find(".result").show();
				}
			}
		})

	$(".lists-popout.lists .create-list label")
		.click(function(){
			var $this = $(this);
			$this.hide().next().focus();
		})

	// create list
	$('.btn-create').click(function(){
		var $this = $(this), $name = $('#new-list-name'), txt = $.trim($name.val());

		if (!txt) {
			$name.focus();
			return alert('Please enter list name');
		}

		$this.prop('disabled', true);

		$.ajax({
			type : 'post',
			url  : '/create_list.xml',
			data : {list_name:txt},
			dataType : 'xml',
			headers  : {'X-CSRFToken':$('input[name="csrfmiddlewaretoken"]').val()},
			success  : function(xml){
				var $xml = $(xml), $st = $xml.find('status_code'), lid = $xml.find('list_id').text();
				if(!$st.length || $st.text() != 1) {
					if($xml.find('message').length) alert($xml.find('message').text());
					return;
				}

				var $ul = $('.lists-popout.lists ul'), $li;
				$li = $('<li><label data-value="'+lid+'">'+txt.replace('<','&lt;')+'</label></li>').prependTo($ul);
				$ul[0].scrollTop = 0;

				$name.val('');
				$this.prevAll('label').show();
			},
			complete : function(){
				$this.prop('disabled', false);
			}
		});

	});
	$('#new-list-name').keyup(function(event){
		if(event.keyCode == 13) {
			event.preventDefault();
			$('.btn-create').click();
		}
	});

	$('.add').click(function(event){
		var $this = $(this);

		if($this.prop('disabled')) return;

		if($this.attr('require_login') == 'true'){
			send({cmd:'close'});
			window.open("/login?close");
			return;
		}

		params.via = 'bookmarklet';
		params.name = $.trim($('#fancy_add-name').val());
		params.tag_url = $.trim($('#fancy_add-link').val());

		if(!params.name) return alert('Please enter name');
		if(!params.category) {
			$('.category_').click();
			return alert('Please choose category');
		}

		$this.prop('disabled', true);

		$.ajax({
			type : 'POST',
			url  : '/add_new_sys_thing.json',
			data : params,
			headers  : {'X-CSRFToken':$('input[name="csrfmiddlewaretoken"]').val()},
			dataType : 'json',
			success  : function(json){
				if(json.status_code == 1){
					var url = 'https://'+location.hostname+json.thing_url;
					$('.popup.add-fancy').hide();
					$('.popup.complete-fancy').show()
						.find('.img').css('backgroundImage', 'url('+params.photo_url+')').end()
						.find('.fancy_add-name').text(params.name).end()
						.find('.fancy_add-link').text(params.tag_url).end()
						.find('.fancy_add-size').text(params.size.width+'x'+params.size.height).end()
						.find('a.add').attr('href', url);
					send({cmd:'resize', height: $("#fancy_add_thing > .popup:visible").height() });
				} else {
					alert(json.message || 'An error occurred while requesting the server.\nPlease try again later.');
				}
			},
			error : function(){
				alert('An error occurred while requesting the server.\nPlease try again later.');
			},
			complete : function(){
				$this.prop('disabled',false);
			}
		});
	});

});

window.onhashchange = function(){
	if(/^#data:/.test(location.hash)) {
		$.extend(args, data = unparam(location.hash.substr(6)));
		onData(data);
	}
};

function onData(data){
	init();

	if(data.error) {
		
	}
	if(params.photo_url=data.img) {
		var img = new Image, $img = $('#product_image');
		img.onload = function(){
			params.size = {width: this.width, height: this.height};
			if (this.width > this.height) {
				$img.css({width:Math.min(this.width,458), height:'auto'});
			} else {
				$img.css({width:'auto', height:Math.min(this.height,458)});
			}
			send({cmd:'resize', height: $("#fancy_add_thing > .popup:visible").height() });
		};
		img.src = data.img;

		$img.attr('src', data.img);
	}
	if(data.title) $('#fancy_add-name').val(data.title);
	if(data.loc || data.path) {
		params.tag_url = (data.loc||'')+(data.path||'/')+(data.search||'');
		$("#fancy_add-link").val(params.tag_url);
	}
};

function init(){
	params = {user_key:$('#user_key').val()};
};

// send data to parent window
function send(data){var p=window.parent,d=$.param(data),u=args.loc+'#data:'+d,l=args.loc.match(/^https?:\/\/[^\/]+/)[0];try{p.postMessage(d,l)} catch(e1){try{p.location.replace(u)}catch(e){p.location.href=u}}};
// unparam
function unparam(s){ var a={},i,c;s=s.split('&');for(i=0,c=s.length;i<c;i++)if(/^([^=]+?)(=(.*))?$/.test(s[i]))a[RegExp.$1]=decodeURIComponent(RegExp.$3||'');return a };
// resized image
function getResizedURL(u,w,h){if(isRetina){w*=2;h*=2};return u.replace(/^(https?:\/\/cf\d+)\.(\w+)\.com/,'$1.thingd.com/resize/'+w+'x'+h+'/$2').replace('/thefancy/', '/thingd/')};

})(jQuery);
