function fixSummary(){
}

$(function() {
  var preventDefault = function(e) {
    if (e.which === 1) e.preventDefault();
  };

  (function() {
    var clicked = false;
    $('.interaction .menu-title, .interaction .menu-content').click(function(e) {
      $(this).closest('.menu-container').toggleClass('opened');
      if($(this).hasClass('menu-title')) e.preventDefault();
      clicked = true;
    });

    $(document).click(function() {
      if (clicked) {
        clicked = false;
        return;
      }
      $('.interaction .menu-container').removeClass('opened');
    });
  })();

  $('#content .delete').click(function(){

    //if (!window.confirm('Are you sure?')) return false;
    var $this = $(this), params = {}, url;

    url = '/delete_featured_find.xml';
    params.ntid = $this.attr('ntid');

    $this.hide();
    $.ajax({
      type : 'post',
      url  : url,
      data : params,
      dataType : 'xml',
      success  : function(xml){
        var $xml = $(xml), $st = $xml.find('status_code');
        if(!$st.length || $st.text() != 1) {
          $this.show();
          return;
        }
        $this.parents('.feature').remove();
      }
    });

    return false;
  });

  $(document).on('click', '.btn-follow', preventDefault).on({
    click : function(e) {
      e.preventDefault();
      var $this = $(this), login_require = $this.attr('require_login'), url, params = {};

      if (typeof(login_require) != undefined && login_require === 'true')  return require_login();
      if ($this.hasClass('loading')) return;

      $this.addClass('loading');

      var isLists = $this.closest('figure').hasClass('lists-frame');
      var isFollow = $this.hasClass('follow');
      var $followerCnt = $('.follower_cnt');
      var isNumber = !isNaN($followerCnt.text());
      var followerCnt = parseInt($followerCnt.text());

      $this.data('old', $this.attr('class'));
      if (isFollow) {
        $this.attr('class', 'btn-follow following');
        if(isNumber) $followerCnt.text(followerCnt+1);
      } else {
        $this.attr('class', 'btn-follow follow');
        if(isNumber) $followerCnt.text(followerCnt-1);
      }

      if(isLists) {
        params.lid  = $this.attr('lid');
        params.loid = $this.attr('loid');
        url  = isFollow ? '/follow_list.xml' : '/unfollow_list.xml';
      } else {
        params.user_id = $this.attr('uid');
        if($this.attr('eid')) params.directory_entry_id = $this.attr('eid');
        url  = isFollow ? '/add_follow.xml' : '/delete_follow.xml';
      }

      $.ajax({
        type : 'post',
        url  : url,
        data : params,
        dataType : 'xml',
        success : function(xml){
          var $xml = $(xml), $st = $xml.find('status_code');
          if (!$st.length || $st.text() != 1) {
            $this.attr('class', $this.data('old'));
          }

          if($this.attr('follow-lists')) {
              var $deletedItem = $this.closest('li.vcard');
              $deletedItem.remove();
          }
        },
        error:function (){
          $this.attr('class', $this.data('old'));
        },
        complete : function(){
          $this.removeClass('loading');
        }
      });
    },
    mouseenter : function(){
      if ($(this).hasClass('following'))
        $(this).attr('class', 'btn-follow unfollow');
    },
    mouseleave : function(){
      if ($(this).hasClass('unfollow'))
        $(this).attr('class', 'btn-follow following');
    }
  }, '.btn-follow');


  $('#user-photo-container')
    .on('mouseover', function(e) {
      $(this).children('.btn-edit').show();
      return false;
    })
    .on('mouseout', function(e) {
      $(this).children('.btn-edit').hide();
      return false;
    });

  $('#lists').on('mouseover','a.fig-image', function(e) {
    if ( $('.wrapper').hasClass('edit')) return;
    var t;
    var $imgs = $(this).find('img');
    if ($imgs.length > 1) {
      var swap = function() {
      var $on = $imgs.filter('.on').removeClass('on');
      if ($on.index() < $imgs.length - 1) {
        $on.next().addClass('on');
      } else {
        $imgs.eq(0).addClass('on');
      }
      t = setTimeout(swap, 1000);
      };
      var end = function() {
      $imgs.removeClass('on');
      $imgs.eq(0).addClass('on');
      window.clearTimeout(t);
      t = null;
      $imgs = null;

      $(document).off('mouseout', end);
      };
      $(document).on('mouseout', end);

      swap();
    }
  });

  (function() {
    var drag = function(e) {
      if (e.which !== 1 || $(this).hasClass('dragging')) return;
      e.preventDefault();
      var $this = $(this);
      var $li = $this.closest('li');

      var $parent = $li.parent();
      var itemCount = $parent.find('li:visible').length;
      $parent.data('rollback', $parent.html());
      var $clone = $li.clone().addClass('dragging').appendTo($parent);

      $li.addClass('hint-drop');

      var pad = 10;
      var LEFT_LIMIT = 114 - pad; // depends on css
      var RIGHT_LIMIT = 566 + pad; // depends on css
      var TOP_LIMIT = 144 - pad; // depends on css
      var BOTTOM_LIMIT = $parent.height() - 156 + pad; // depends on css
      var parentOffset = $parent.offset();
      var getIndexByOffset = function (x, y) {
        var BLOCK_WIDTH = 200;
        var BLOCK_HEIGHT = 310;
        var idx = Math.min(Math.floor(x / BLOCK_WIDTH), 2) + Math.floor(y / BLOCK_HEIGHT) * 3;
        //if (idx == 0) idx = 1;
        return idx;
      };

      var handleMove = function(e) {
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        relX = Math.min(Math.max(relX, LEFT_LIMIT), RIGHT_LIMIT);
        relY = Math.min(Math.max(relY, TOP_LIMIT), BOTTOM_LIMIT);
        $clone.css({left:relX, top:relY});

        var srcIdx = $parent.find('li:visible').index($li);
        var targetIdx = getIndexByOffset(relX, relY);
        targetIdx = Math.min(targetIdx, itemCount);

        if (srcIdx < targetIdx) {
          $li.insertAfter($parent.find('li:visible').eq(targetIdx));
        } else if (srcIdx > targetIdx) {
          $li.insertBefore($parent.find('li:visible').eq(targetIdx));
        }
      };
      var handleUp = function() {
        $('body').off('mousemove', handleMove).off('mouseup', handleUp).css('cursor','auto');
        $clone.remove();
        $li.removeClass('hint-drop');
        $li = null;
        $parent = null;
        $clone = null;
      };
      handleMove(e);
      $('body').on('mousemove', handleMove).on('mouseup', handleUp).css('cursor','move');
    };

    $("#organize-lists-button").click(function(e) {
      e.preventDefault();
      $(this).parents('.wrapper').addClass('edit');
      $('#organize-lists').slideDown(200);
      $("#lists").addClass("editing");
      $('#lists a').on('click', preventDefault);
      $('#lists').on('dragstart', preventDefault);
      $('#lists').on('mousedown','figure', drag);
      $("#lists > li#wrapper-create").hide();
    });

    $("#organize-lists")
      .on("click", '#edit-list-done', function(e) {
        var list_ids = '';
        $('.vcard') .each(function(){
          var lid = $(this).attr('lid');
          if (lid != undefined) {
            if (list_ids.length>0)
              list_ids = list_ids + ','+lid;
            else
              list_ids = ''+lid;
          }
        });
        var param = {};
        param['update_lists']=list_ids;
        $.post("/organize_lists_new.xml",param, function(xml){
          if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {

          }
          else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
            alert($(xml).find("message").text());
          }
        }, "xml");
      })
      .on("click", '#edit-list-cancel', function(e) {
        $('#lists').html($('#lists').data('rollback'));
      })
      .on("click", 'button', function(e) {
        e.preventDefault();
        $(this).parents(".wrapper").removeClass("edit");
        $('#organize-lists').slideUp(200);
        $("#lists").removeClass("editing");
        $('#lists a').off('click', preventDefault);
        $('#lists').off('dragstart', preventDefault);
        $('#lists').off('mousedown', drag);
        $("#lists > li#wrapper-create").show();
      });
  })();

  var $list_options = $('#lists-option-button dl dd');
  $list_options.click(function(e) {
    if ($(this).find('a').hasClass('on')) {
      e.preventDefault();      
      return;
    }
    $list_options.find('.on').removeClass('on');
    $(this).find('a').toggleClass('on');
    $('#lists-option-button').removeClass('opened');
    console.log($(this).find('a').attr('option'));
  });

  $("#save_profile_image").on('click',function(e){
    var $this = $(this), $file = $('#uploadavatar'), file = $file.val(), $form = $('#form-photo')[0];
    var userid = $('#userid').val();
    if(!file) return false;
    var $change_photo = $this.closest('.change-photo');
    $change_photo.addClass('uploading');

    $.ajaxFileUpload( {
      url:'/settings_image.xml?userid=' + userid,
      secureuri:false,
      fileElementId:'uploadavatar',
      dataType: 'xml',
      success: function (xml, status)
      {
        var $xml = $(xml), $st = $xml.find('status_code');
        $change_photo.removeClass('uploading none');

        if ($st.length>0 && $st.text()==1) {
          var url = $xml.find('original_image_url').text();
          $('#uploaded-photo, #user-photo').css('background-image', 'url(' + url + ')');
          $form.reset();
          $.dialog("change-photo").close();
        } else if ($st.length>0 && $st.text()==0) {
          alert($xml.find("message").text());
          return false;
        } else {
          alert("Unable to upload file..");
          return false;
        }
      },
      error: function (data, status, e)
      {
        $change_photo.removeClass('loading');

        alert(e);
        return false;
      }
    });

    $file.attr('value','');

    e.preventDefault()
  });

  $('#delete_profile_image').on('click',function(e){
    if (window.confirm('Are you sure?')){
      var $change_photo = $(this).closest('.change-photo'), $form = $('#form-photo')[0];
      $change_photo.addClass('uploading');
      $.post(
        '/delete_profile_image2.json',
        {}, // parameters
        function(response){
          if (response.status_code != undefined && response.status_code == 1) {
            var url = response.user_image_url;
            $('#uploaded-photo, #user-photo').css('background-image', 'url(' + url + ')');
            $change_photo.removeClass('uploading');
            $change_photo.addClass('none');
            $form.reset();
            $.dialog("change-photo").close();
          }
          else if (response.status_code != undefined && response.status_code == 0) {
            if(response.message != undefined)
              alert(response.message);
          }
        },
        "json"
      );
      return false;
    }
    e.preventDefault()
  });

  (function() {
    var tooltip = function(target) {
        var $target = $(target);
        if (!$('#tooltip').length) {
            $('<span>').attr('id','tooltip').appendTo(document.body);
        }
        var $tooltip = $('#tooltip').show();

        $tooltip.text($target.text());
        var o = $target.offset();
        o.left = Math.round(o.left - ($tooltip.width() + 16 - $target.width()) / 2); //16:#tooltip's padding
        o.top = Math.round(o.top - ($tooltip.height() + 9));
        $('#tooltip').offset(o);
    };

    $(document).delegate('.tooltip','mouseenter',function() {
        tooltip(this);
    });
    $(document).delegate('.tooltip','mouseleave',function() {
        $('#tooltip').hide();
    });

  })();

  $.dialog('report-user').$obj
    .find(".btn-report").click(function(e){
      e.preventDefault();
      var $this = $(this);
      var username = $this.attr('username');
      var reason = $this.closest('.popup').find("textarea").val();
      $.ajax({
        type : 'post',
        url  : '/'+username+'/submit-inappropriate-user.json',      
        data : {reason:reason},
        dataType : 'json',
        success  : function(json){          
          // to do something?
          if (json.status_code) {
            $this.closest('.popup').find('.success').show();
            $('.report').addClass('reported').html(gettext('Undo reporting'))
          }
        }
      }).fail(function(xhr) {
        try {
            var json = JSON.parse(xhr.responseText)
            var error = json.error || json.message
            if(error) {
                alertify.alert(error)
                return
            }
        } catch(e) {
        }
        alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
      });
    })

  // report profile
  $('.report').click(function(event){
    var $this = $(this);

    event.preventDefault();

    if($this.attr('require_login') === 'true') return require_login();

    if($this.hasClass('reported')){
      var original_labels = alertify.labels;
      alertify.set({'labels': {ok: 'Cancel Report', cancel: 'Go Back'}});

  		alertify.confirm(gettext('Are you sure you want to cancel your report?'), function (e) {
  			if (e) {
  			  var username = $this.attr('username');
  			  $.ajax({
  				type : 'post',
  				url  : '/'+username+'/cancel-inappropriate-user.json',      
  				dataType : 'json',
  				success  : function(json){          
  				  // to do something?
  				  if (json.status_code) {
  					alert(gettext("Report cancelled."));
  					$this.removeClass('reported').html(gettext('Report User'))
  				  }
  				}
  			  });
  			} else {
  				return;
  			}
  		});
      alertify.set({'labels': original_labels});
    }else{
      $('.popup.report-user .success').removeAttr('style');
  		$.dialog('report-user').open();
    }
    return false;
  });

  var dlg = $.dialog('followers-lists');

  var isLoading = false;
  function loadUsers(url, callback){
    if(isLoading) return;
    isLoading = true;
    dlg.$obj.find("div > ul").append('<li class="loading"></li> ');
          
    $.ajax({
      type : 'get',
      url  : url,
      dataType : 'html',
      success  : function(html){
        isLoading = false;
        callback(html);
      }
    });
  }
  function userScroll(e){
      var $this = $(this);
      var scrollTop = $this.scrollTop();
      var scrollHeight = $this[0].scrollHeight;
      if(scrollTop > scrollHeight - $this.height() - 100 ){
        var nextUrl = $this.closest(".popup").find("a.btn-next").attr('href');
        if(nextUrl){
          loadUsers(nextUrl, function(html){
            var $html = $(html);
            dlg.$obj.find("div > ul").find('li.loading').remove().end().append( $html.find("li") ).end();
            var nextUrl = $html.find("a.btn-next").attr("href");
            if(nextUrl){
              dlg.$obj.find("div a.btn-next").attr('href', nextUrl );  
            }else{
               dlg.$obj.find("div a.btn-next").remove();
            }
          });
        }
      }
  };


  $("#summary .followers, #sidebar .followers")
    .find("._followers").click(function(e){
      e.preventDefault();
      var username = $(this).attr('username');
      dlg.$obj.addClass('loading').find("p.ltit").html("Followers").end().find("div").empty();
      loadUsers('/'+username+'/followers?popup', function(html){
        dlg.$obj.removeClass('loading').find("div").html( html );
        dlg.$obj.find("div > ul").off('scroll').on('scroll', userScroll);
      });
      dlg.open();
      return false;
    })
    .end()
    .find("._following").click(function(e){
      e.preventDefault();
      var username = $(this).attr('username');
      dlg.$obj.addClass('loading').find("p.ltit").html("Following").end().find("div").empty();
      loadUsers('/'+username+'/following?popup', function(html){
        dlg.$obj.removeClass('loading').find("div").html( html );
        dlg.$obj.find("div > ul").off('scroll').on('scroll', userScroll);
      });
      dlg.open();
      return false;
    })
    
  
});

$(document).ready(function(){

  // add onload event handler for https://app.asana.com/0/2447287358540/7934931003736
 /* $('.feature .figure-item img').load(function(){
    $(this).parents('.feature').find('.delete').css('margin-right',(640-$(this).width())/2+'px').end().find('.back').width($(this).width()).css('left',((640-$(this).width())/2)+'px');
  });
  $('.feature .figure-item img').each(function(){
    $(this).parents('.feature').find('.delete').css('margin-right',(640-$(this).width())/2+'px').end().find('.back').width($(this).width()).css('left',((640-$(this).width())/2)+'px');
  }); */

	$('.user_fn .view-store, .user_fn .send-msg').hover(function(){
		$(this).find('span').css('margin-left',-($(this).find('span').width()/2)-10+'px');
	});

	$('#summary .sns a').each(function(){
		$(this).find('em').css('margin-left',-($(this).find('em').width()/2)-9+'px');
	});
	$('.usersection .badge-list li').each(function(){
		var $this = $(this);
	  if($this.find('img').attr('src')==''){
		$this.hide();
	  }
	});


  window.fbAsyncInit = function() {
      FB.init({appId: '180603348626536', version: 'v2.8', status: true,cookie: true, xfbml: true,oauth : true});
  };
  (function() {
    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.src = document.location.protocol + '//connect.facebook.com/en_US/sdk.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
  }());
});
