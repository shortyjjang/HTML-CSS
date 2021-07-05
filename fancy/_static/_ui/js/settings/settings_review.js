jQuery(function($){
	
	var review_dlg = $.dialog('review-orders');
	var $reviewList = $(".review_list");

	$reviewList
		.on('click', 'ul > li > a', function(e){
			e.preventDefault();
			var $this = $(this);
			var $li = $this.closest('li');
            review_dlg.$obj
                .find("span.tit").html( $li.find("span.tit").html() ).end()
                .find("span.price").html( $li.attr("data-price") ).end()
                .find("input").val( $li.attr("data-title") ).end()
                .find("textarea").val( $li.find('textarea').val() ).end()
                .find("span.value").attr('value',$li.attr("data-rating")).find("> small").css('width', ($li.attr("data-rating")*10)+"%" ).end().end()
                .attr('rid', $li.attr('data-rid')).attr('siid', $li.attr('data-siid')).attr('sioid', $li.attr('data-sioid'))
            review_dlg.open();
		})

	function updateReview(data){
		var $li = $(".review_list ul li[data-siid="+data.sale_item_id+"][data-rid="+data.prev_id+"]");
		$li
			.attr('data-rid', data.id)
			.attr('data-title', data.title)
			.attr('data-rating', data.rating)
			.find("textarea").val(data.body).end()
			.find("span.rating i").css('width', (data.rating*10)+"%").end()
	}

	review_dlg.$obj
            .find(".btn-delete").click(function(e){
            	var siid = review_dlg.$obj.attr('siid');
            	var sioid = review_dlg.$obj.attr('sioid');
                var rid = review_dlg.$obj.attr('rid');
                
                alertify.confirm("Are you sure?", function(e){
					if (e){
		                $.ajax({
		                	url : '/rest-api/v1/reviews/'+siid+'/'+rid, 
		                	type : 'delete',
		                	success :  function(res){
			                    review_dlg.close();
			                    if(sioid){
									$(".review_list ul > li[data-siid="+ siid+"][data-sioid="+sioid+"][data-rid="+rid+"]").remove();
			                    }else{
			                    	$(".review_list ul > li[data-siid="+ siid+"][data-rid="+rid+"]").remove();
			                    }
			                    if( !$(".review_list ul > li").length ){
			                    	location.reload();
			                    }
			                }
		                });
		            }

                })
               
            }).end()
            .find(".btn-submit").click(function(e){
                var siid = review_dlg.$obj.attr('siid');
                var sioid = review_dlg.$obj.attr('sioid');
                var rid = review_dlg.$obj.attr('rid');
                var params = {
                    title: review_dlg.$obj.find("input.text").val(),
                    body: review_dlg.$obj.find("textarea.text").val(),
                    rating: review_dlg.$obj.find("span.value").attr('value'),
                    overwrite: true
                };
                if(sioid) params.option_id = sioid;

                if( !params.title){
                    alertify.alert("Please enter title");
                    return;
                }
                if( !params.body){
                    alertify.alert("Please enter comments");
                    return;
                }

                $.post('/rest-api/v1/reviews/'+siid, params, function(res){
                	res.prev_id = rid;
                    updateReview(res);
                    review_dlg.close();
                });
               
            }).end()
            .find(".btn-cancel").click(function(e){
                review_dlg.close();     
            }).end()
            .find(".rating .value").click(function(e){
                var val = e.pageX-$(this).offset().left;
                var max = 75;
                var rating = 10;
                for(var i=10; i>0; i-=2){
                    if( val >= (i-2)*max/10 ){
                        rating = i;
                        break;
                    }
                }

                $(this).attr('value',rating).find('small').css('width', rating*10+'%');
            });
});