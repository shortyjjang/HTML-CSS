(function($) {
  "use static";
  
  $(function() {

    function update(options) {
      var thenable;
      var $btn = options.$btn
      if (options.objectType === 'thing') {
        thenable = updateThing(options.objectId, {fancyd:options.fancyd})
      } else if (options.objectType === 'article') {
        thenable = updateArticle(options.objectId, options.fancyd)
      }
      thenable
        // .done(function(json){
        //   if (json.fancyd) return;
        // })
        .fail(function(e){
          if(e.status==403){
            location.href = "/login";
          }
        })
        .always(function(){ $btn.disable(false);$btn.data('loading', false);});
    }

    function updateThing(thing_id, data) {
      return $.ajax({
        type : 'PUT',
        url  : '/rest-api/v1/things/'+thing_id,
        data : data
      });
    }

    function updateArticle(article_id, nextFancyd) {
      return $.ajax({
        type: 'POST',
        url: '/articles/save.json',
        data: {
          article_id: article_id,
          action: nextFancyd ? 'save':'unsave',
        }
      })
    }

    // when click Fancy Button
    $(document)
      .delegate('.fancyd, .fancy', 'click', function(event){
        if( $(this).attr('v')!=4 ) return;

        event.preventDefault();

        var $btn=$(this),fancyd, tid;
        var objectType, objectId;
        tid  = $btn.attr('tid') || $btn.attr('data-tid') || null;
        fancyd = $btn.hasClass('fancyd');
        objectType = $btn.attr('data-object-type') || 'thing';
        objectId = $btn.attr('data-object-id') || tid;

        if( !objectId ) return;
        if($btn.attr('require_login')) return require_login();
        if($btn.data('loading')) return;
        $btn.data('loading', true);
        $btn.disable();

        if(fancyd){
          var fancydCnt = $btn.text();
          if( !isNaN(fancydCnt) ){
            var fancydCnt = Math.max(0, (parseInt(fancydCnt.replace(/,/g,''), 10)||0)-1 );
            $btn[0].lastChild.nodeValue = addCommas(fancydCnt);
          }
          $btn.removeClass('fancyd').addClass('fancy');
        
          var $fancydUser = $btn.closest('.buttons').find("span.fancyd_user");
          if( $fancydUser.find("._viewer:visible").length ){
            $fancydUser.addClass('remove').find("._viewer").hide().end().find("a:last").css('display','inline');
            setTimeout(function(){$fancydUser.removeClass('remove')},1000);
          }
          update({ objectType: objectType, objectId: objectId, fancyd: false, $btn: $btn })
        }else{
          $btn.addClass('loading');
          // fancy
          // var bgIdx =[0, -54, -108, -163, -218, -272, -327, -436, -490, -545, -599, -654, -708, -763, -817, -872, -926, -981, -1035, -1144, -1199, -1253, -1308, -1417, -1471];
          var fancydCnt = $btn.text();
          if( !isNaN(fancydCnt) ){
            fancydCnt = Math.max(0, (parseInt(fancydCnt.replace(/,/g,''), 10)||0)+1 );
            $btn[0].lastChild.nodeValue = addCommas(fancydCnt);
          }
          
          // function setButtonBg(idx){
          //   if(bgIdx[idx]!=null){
          //     $btn.find("span").css('background-position-x', bgIdx[idx]+"px");
          //     setTimeout(function(){setButtonBg(idx+1)}, 10);
          //   }else{
          //     $btn.removeClass('loading').removeClass('fancy').addClass('fancyd');  
          //   }
          // }
          // setButtonBg(0);
          $btn.removeClass('loading').removeClass('fancy').addClass('fancyd');
          var $fancydUser = $btn.closest('.buttons').find("span.fancyd_user");
          $fancydUser.addClass('add').find("._viewer:first").css('display','inline').end().find("a:last").hide();
          setTimeout(function(){$fancydUser.removeClass('add')},1000);

          update({ objectType: objectType, objectId: objectId, fancyd: true, $btn: $btn })
        }
      });

  });

})(jQuery);

