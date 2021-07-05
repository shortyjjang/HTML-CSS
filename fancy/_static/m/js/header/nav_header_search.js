
(function(){
	var $result = $("#aside_left .search-result");
	var $things = $result.find(".search-thing");
	var $keywords = $result.find(".search-keywords");
	var $users = $result.find(".search-people");
	var $stores = $result.find(".search-store");
	var $tpl_thing = $("#tpl-search-suggestions-things");
	var $tpl_keywords = $("#tpl-search-suggestions-keywords");
	var $tpl_user = $("#tpl-search-suggestions-people");
	var $tpl_store = $("#tpl-search-suggestions-store");		
	var $tpl_recently = $("#tpl-search-suggestions-recently");
	var $recently = $result.find('ul.recently');
	var $clear = $result.find('a.clear-all');

	$("a.btn-search").click(function(e){
		e.preventDefault();
		$(this).closest('#aside_left').find('.default').hide().end().find('.search').show();
		
		$.ajax({
	        type : 'GET',
	        url  : '/search-gethistory.json',
	        dataType : 'json',
	        success  : function(json){
	        	$recently.empty();

	        	$result.show().find("a.more").hide();

	        	if(json.search_history && json.search_history.length){
	            	$.each(json.search_history, function(i,v,a){
						$tpl_recently.template({TEXT: $("<div>").text(v).html()}).appendTo($recently);
					});
					$clear.show();
	            }
	            $things.hide();
	            $keywords.hide();
	        	$users.hide();
	        	$stores.hide();
	        	$recently.show();
	            
	            //$suggest.removeClass('loading');
	        }
	    });
	})

	var searchTimer;
	$('#aside_left .search-top input').bind("propertychange keyup input paste", function(e){
		e.preventDefault();
		if(searchTimer) clearTimeout(searchTimer);
		var word = $("#aside_left .search-top input").val();
		if(word) $('#aside_left .search-top .remove').show();
		else $('#aside_left .search-top .remove').hide();
		searchTimer = setTimeout( (function(q){searchSuggestion(q);}).bind(this,word) ,200);
	});
	$('#aside_left .search-top input').bind("keyup", function(e){
		e.preventDefault();
		if (e.keyCode && e.keyCode == 13){
			var word = $("#aside_left .search-top input").val();
			document.location.href = "/search?q="+word;
		}
	});
	$('#aside_left .search-top a.remove').bind("click", function(e){
		e.preventDefault();
		$("#aside_left .search-top input").val('').trigger('paste');
	});

	function searchSuggestion(word){
		$result.find('a.clear-all').hide();
		$things.find("a.more").addClass("loading");

		if(!word){
			$result.show().find("a.more").hide();
			$things.hide();
			$keywords.hide();
        	$users.hide();
        	$stores.hide();
        	$recently.show();
        	if($recently.find("li").length) $clear.show();
        	return;
		}
		$.ajax({
			type : 'GET',
			url  : '/search-suggestions.json',
			data : {q:word,thing_limit:5, home_v3:'true'},
			dataType : 'json',
			success  : function(json){
				$things.find("a.more").removeClass("loading");
				try {
					$result.find("a.more").attr("href","/search?q="+word);

					if(json.things && json.things.length){
						$things.show().find("li").detach();
						$.each(json.things, function(i,v,a){
							$tpl_thing.template({URL:v.html_url, IMG_URL:v.thumb_url, TITLE:v.name}).appendTo($things);
						});
					}else{
						$things.hide();
					}

					if(json.keywords && json.keywords.length){
						$keywords.show().find("li").detach();
						$.each(json.keywords, function(i,v,a){
							$tpl_keywords.template({TEXT: $("<div>").text(v).html()}).appendTo($keywords);
						});
					}else{
						$keywords.hide();
					}
										
					if(json.users && json.users.length){
						$users.show().find("dd").detach();
						$.each(json.users, function(i,v,a){
							$tpl_user.template({URL:v.html_url, IMG_URL:v.image_url, USERNAME:v.username, FULLNAME:v.fullname}).appendTo($users);
						});
					}else{
						$users.hide();
					}

					if(json.stores && json.stores.length){
						$stores.show().find("dd").detach();
						$.each(json.stores, function(i,v,a){
							$tpl_store.template({URL:v.html_url, IMG_URL:v.image_url, USERNAME:v.username, FULLNAME:v.fullname}).appendTo($stores);
						});
					}else{
						$stores.hide();
					}

					$result.show().find("ul.recently").hide();
					//$loading.hide();
				} catch(e) {
					console.log(e);
				}
			}
		});
	}


    $('#aside_left .search-result').on('click', '.clear-all', function(e) {
        e.preventDefault();
        $.ajax({
            type : 'POST',
            url : '/search-deleteallhistory.json',
            dataType : 'json',
            success : function(json) {
                if (json.status_code == 1) {
                    $recently.empty().hide();
                    $clear.hide();
                    $result.hide();
                } else if (json.status_code == 0) {
                    alert(json.message);
                }
            },
        });
    });

})();