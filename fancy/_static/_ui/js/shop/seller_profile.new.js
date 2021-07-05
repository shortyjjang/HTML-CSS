
var preventDefault = function (e) {
  if (e.which === 1) e.preventDefault();
}

$(function () {

  var $stream = $('#content .stream').attr('loc', location.pathname.replace(/\//g, '-').substr(1)),
    $last;
  $last = $stream.find('>li:last-child');
  $stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
  if (!$stream.find('> li').length) {
    var args = $.extend({}, location.args);
    if (!$.param(args)) {
      $('div.yet_product').show();
      $('.wrapper-content').removeClass('refine');
      $('#summary .refine a').remove();
    } else {
      $('div.empty-result').show();
    }
  }


  $('.shop .search_keyword input').focus(function () {
    $(this).parents('dd').find('.ic-search').addClass('on');
  });
  $('.shop .search_keyword input').blur(function () {
    if ($(this).val() == '') {
      $(this).parents('dd').find('.ic-search').removeClass('on');
    }
  });

  $('.cate li, .category li').delegate('a', 'click', function (event) {
    event.preventDefault();
    $('.cate a.current, .category a.current').removeClass('current');
    $(this).addClass("current").closest('.category-filter').find("dt a").text($(this).text());
    $(this).closest('dl').toggleClass('show');

    var url = $(this).attr('href'),
      args = $.extend({}, location.args),
      query;

    if (args.categories) delete args.categories;
    if (query = $.param(args)) {
      if (url.indexOf("?") > 0) url += '&' + query;
      else url += '?' + query;
    }

    loadPage(url);
  });

  // New category (v4)
  $('#refine-by-category').on('change', function (event) {
    event.preventDefault();
    var url = $(this).val(),
      args = $.extend({}, location.args),
      query;

    if (args.categories) delete args.categories;
    if (query = $.param(args)) {
      if (url.indexOf("?") > 0) url += '&' + query;
      else url += '?' + query;
    }

    loadPage(url);
  });

  // keyword search
  $('.filter .keyword input[type=text]')
    .hotkey('ENTER', function (event) {
      var q = $.trim(this.value),
        url = location.pathname,
        args = $.extend({}, location.args),
        query;

      event.preventDefault();

      if (q) {
        args.q = q;
      } else {
        delete args.q;
      }

      if (query = $.param(args)) url += '?' + query;

      loadPage(url);
    })
    .keyup(function () {
      var hasVal = !!$.trim(this.value);
      if (hasVal) {
        $(this).parent().find('.remove').show()
      } else {
        $(this).parent().find('.remove').hide()
      }
    })
    .keyup();

  // remove keyword
  $('.filter .keyword .remove').click(function (event) {
    event.preventDefault();
    $(this).parent().find('input[type=text]').val('').keyup();

    var url = location.pathname,
      args = $.extend({}, location.args),
      query;

    event.preventDefault();
    delete args.q;

    if (query = $.param(args)) url += '?' + query;

    loadPage(url);
  })



  $(".ships li a").on("click", function (event) {
    event.preventDefault();
    var ships_to = $(this).attr('value'),
      url = location.pathname,
      args = $.extend({}, location.args),
      query;

    if (ships_to) {
      args.ships_to = ships_to;
    } else {
      delete args.ships_to;
    }

    if ((query = $.param(args))) url += "?" + query;
    setOptions(args);

    loadPage(url);
    $(this)
      .closest(".ships")
      .find("dt a")
      .text(
        $(this).text()
      );
    $(this).closest('dl').toggleClass('show');
  });


  $(".color li").on("click", function (event) {
    event.preventDefault();
    var color = $(this).find("input").val(),
      url = location.pathname,
      args = $.extend({}, location.args),
      query;

    if (color) {
      args.c = color;
    } else {
      delete args.c;
    }

    if ((query = $.param(args))) url += "?" + query;
    setOptions(args);

    loadPage(url);
    $(this)
      .closest(".color")
      .find("dt a")
      .text(
        $(this).find("label").text()
      );
    $(this).closest('dl').toggleClass('show');
  });


  // new sort option (v4)
  $(".sort li a").on("click", function (event) {
    event.preventDefault();
    var sort_by_price = $(this).data('sortby'),
      url = location.pathname,
      args = $.extend({}, location.args),
      query;

    if (sort_by_price) {
      args.sort_by = sort_by_price;
    } else {
      delete args.sort_by;
    }

    if ((query = $.param(args))) url += "?" + query;
    setOptions(args);

    loadPage(url);
    $(this)
      .closest(".sort")
      .find("dt a")
      .text(
        $(this).text()
      );
    $(this).closest('dl').toggleClass('show');
  });
    $('select#order-by').on('change', function(event){
        event.preventDefault();
        var sort_by_price = $(this).val(), url = location.pathname, args = $.extend({}, location.args), query;
        
        if(sort_by_price){
            args.sort_by = sort_by_price;
        } else {
            delete args.sort_by;
        }

        if(query = $.param(args)) url += '?'+query;
        setOptions(args);

        loadPage(url);
        $(this).closest('.more').find('.order-by-label').text($(this).find('option:selected').text());
    });

  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 1000,
    step: 10,
    values: [parseInt($(".price .amount .min").text()), parseInt($(".price .amount .max").text())],
    slide: function (event, ui) {
      if (ui.values[1] - ui.values[0] < 10) return false;;
      $(".price .amount .min").text(ui.values[0] || 1);
      $(".price .amount .max").text(ui.values[1] + (ui.values[1] == 1000 ? "+" : ""));
    },
    change: function (event, ui) {
      var min_price = ui.values[0],
        max_price = ui.values[1],
        url = location.pathname,
        args = $.extend({}, location.args),
        query;

      if (max_price == 1000) max_price = "";
      if (max_price && !min_price) min_price = "1"

      if (min_price || max_price) {
        var price = min_price + "-" + max_price;
        args.p = price;
      } else {
        delete args.p;
      }

      if (query = $.param(args)) url += '?' + query;

      loadPage(url);
    }
  });

  function setOptions(params) {


  }

  var ajax = null;

  function loadPage(url, skipSaveHistory) {
    var $win = $(window),
      $stream = $('#content ol.stream');

    var $lis = $stream.find('>li'),
      scTop = $win.scrollTop(),
      stTop = $stream.offset().top,
      winH = $win.innerHeight(),
      headerH = $('#header-new').height(),
      useCSS3 = Modernizr.csstransitions,
      firstTop = -1,
      maxDelay = 0,
      begin = Date.now();

    if (useCSS3) {
      $stream.addClass('use-css3').removeClass('fadein');

      $lis.each(function (i, v) {
        if (!inViewport(v)) return;
        if (firstTop < 0) firstTop = v.offsetTop;

        var delay = Math.round(Math.sqrt(Math.pow(v.offsetTop - firstTop, 2) + Math.pow(v.offsetLeft, 2)));

        v.className += ' anim';
        setTimeout(function () {
          v.className += ' fadeout';
        }, delay + 10);

        if (delay > maxDelay) maxDelay = delay;
      });
    }

    if (!skipSaveHistory && window.history && history.pushState) {
      history.pushState({
        url: url
      }, document.title, url);
    }
    location.args = $.parseString(location.search.substr(1));

    setOptions(location.args);

    $('.pagination > a').remove().attr('href', '');
    $("#content").addClass("loading");

    try {
      if (ajax) ajax.abort()
    } catch (e) {};

    ajax = $.ajax({
      type: 'GET',
      url: url,
      dataType: 'html',
      success: function (html) {
        setOptions(location.args);

        $stream.attr('loc', location.pathname.replace(/\//g, '-').substr(1));

        var $html = $($.trim(html)),
          $new_more = $html.find('.pagination > a');


        $stream.html($html.find('#content ol.stream').html());

        if (!$stream.find('> li').length) {
          $stream.css('height', '');
          $('div.empty-result, div.yet_product').show();
        } else $('div.empty-result, div.yet_product').hide();

        if ($new_more.length) $('.pagination').append($new_more);
        $("#content").removeClass("loading");

        (function () {
          // reset infiniteshow
          $.infiniteshow({
            itemSelector: '#content .stream > li',
            post_callback: function () {
            }
          });
        })();
      }
    });

    function inViewport(el) {
      return (stTop + el.offsetTop + el.offsetHeight > scTop + headerH) && (stTop + el.offsetTop < scTop + winH);
    };
  };


  $(window).on('popstate', function (event) {
    var e = event.originalEvent,
      $stream;
    if (!e || !e.state) return;

    $stream = $('#content .stream');
    if ($stream.data('restored')) {
      $stream.data('restored', false);
    } else {
      loadPage(event.originalEvent.state.url, true);
    }
  });


  // Search Sameday Area
  var area_cache = {};

  var search_area_by_first_3 = function (query) {
    var dfd = new $.Deferred();
    var query_first_3 = query.substr(0, 3);
    var areas = area_cache[query_first_3];
    if (areas) {
      result = areas.filter(function (x) {
        return x[x.key].toUpperCase().indexOf(query) >= 0
      });
      dfd.resolve(result);
    } else {
      var param = {
        area: query_first_3
      };
      $.post("/search_sds_area.json", param, function (json) {
        area_cache[query_first_3] = json;
        result = json.filter(function (x) {
          return x[x.key].toUpperCase().indexOf(query) >= 0
        });
        dfd.resolve(result);
      }, 'json');
    }
    return dfd.promise();
  };

  var $list = $('.zip-list');
  $list
    .on('key.up key.down', function (event) {
      if ($list.is(':hidden')) return false;
      var $items = $list.children('li'),
        up = (event.namespace == 'up'),
        idx = Math.min(Math.max($items.filter('.on').index() + (up ? -1 : 1), 0), $items.length - 1);
      var $on = $items.removeClass('on').eq(idx).addClass('on'),
        bottom;
      if (up) {
        if (this.scrollTop > $on[0].offsetTop) this.scrollTop = $on[0].offsetTop;
      } else {
        bottom = $on[0].offsetTop - this.offsetHeight + $on[0].offsetHeight;
        if (this.scrollTop < bottom) this.scrollTop = bottom;
      }
    })
    .on('mouseover', 'li', function (event) {
      event.preventDefault();
      $list.children('li').removeClass('on');
      $(this).addClass('on');
      return false;
    })
    .on('key.enter', function () {
      var $on = $list.children('li.on');
      if ($on.length > 0) {
        $on.click();
      } else {
        $list.children('li').eq(0).click();
      }
    })
    .delegate('li', 'click', function (event) {
      event.preventDefault();
      var $li = $(this),
        area = $li.data();

      if (!area || !area.key) {
        return;
      }
      if (area.key == 'zipcode') {
        current_area_val = area.zipcode + ", " + area.name;
      } else {
        current_area_val = area.name + ", " + (area.state ? area.state : area.country);
      }
      $('#search-sameday-zip').val(current_area_val);
      $('#search-sameday-zip').attr('_value', area.name);

      $('input[name=areakey]').val(area.area_key);

      $list.hide();

      filterBySamedayShipping();
    });

  var $inp = $('#search-sameday-zip');
  var current_area_val;
  var prev_val = '';

  $inp.on({
    changed: function (event) {
      var val = $inp.val();
      if (val && val.length > 0) {
        $inp.parents('fieldset').find('.remove').show();
      } else {
        $inp.parents('fieldset').find('.remove').hide();
      }
      if (val && val.length > 2) {
        $.when(search_area_by_first_3(val.toUpperCase())).done(function (areas) {
          $list.empty();
          var $htmls = [],
            html;
          var until = Math.min(areas.length, 10);
          if (until > 0) {
            for (var i = 0; i < until; i++) {
              var area = areas[i],
                $html;
              if (area.key == 'zipcode') {
                $html = $("<li><a href='#'><i class='ic-location'></i><b>" + area.zipcode + "</b> " + area.name + "</a></li>");
              } else {
                $html = $("<li><a href='#'><i class='ic-location'></i><b>" + area.name + "</b> " + (area.state ? area.state : area.country) + "</a></li>");
              }
              if (i == 0) {
                $html.addClass('on');
              }
              $html.data(area);
              $list.append($html);
            }
          }
          $list.show();
        });
      } else {
        $list.hide();
      }
    },

    keydown: function (event) {
      setTimeout(function () {
        var val = $.trim($inp.val());
        if (val == prev_val) return;
        prev_val = val;
        $inp.trigger('changed')
      }, 10);
      switch (event.keyCode) {
        case 13:
          $list.trigger('key.enter');
          break;
        case 38:
          $list.trigger('key.up');
          return false;
        case 40:
          $list.trigger('key.down');
          return false;
      }
    },

    focus: function (event) {
      current_area_val = $('#search-sameday-zip').val();
      //$('#search-sameday-zip').val( $('#search-sameday-zip').attr("_value") );
      setTimeout(function () {
        $('#search-sameday-zip').select();
      }, 100);
    },

    blur: function (event) {
      setTimeout(function () {
        $list.hide();
        $('#search-sameday-zip').val(current_area_val);
      }, 100);
    }
  });



  $(document).on('click', '.btn-follow', preventDefault).on({
    click: function (e) {
      e.preventDefault();
      var $this = $(this),
        login_require = $this.attr('require_login'),
        url, params = {};

      if (typeof (login_require) != undefined && login_require === 'true') return require_login();
      if ($this.hasClass('loading')) return;

      $this.addClass('loading');

      var isLists = $this.closest('figure').hasClass('lists-frame');
      var isFollow = $this.hasClass('follow');

      $this.data('old', $this.attr('class'));
      if (isFollow) {
        $this.attr('class', 'btn-follow following');
      } else {
        $this.attr('class', 'btn-follow follow');
      }
      var modifyFollow;
      if (isLists) {
        params.lid = $this.attr('lid');
        params.loid = $this.attr('loid');
        url = isFollow ? '/follow_list.xml' : '/unfollow_list.xml';
      } else {
        params.user_id = $this.attr('uid');
        if ($this.attr('eid')) params.directory_entry_id = $this.attr('eid');
        if ($this.attr('sid')) {
          params.seller_id = $this.attr('sid');
          var followCntStr = $this.find("small:eq(0)").text().toLowerCase();
          var followCnt;
          var modifyCnt;
          if (_.include(followCntStr, 'k') || _.include(followCntStr, 'm')) {
            modifyCnt = false;
            followCnt = followCntStr;
          } else {
            modifyCnt = true;
            followCnt = parseInt(followCntStr);
          }
          if (isFollow) {
            if (modifyCnt) {
              followCnt = followCnt += 1;
            }
            try {
              track_event('Follow Store', {
                seller_id: params.seller_id
              });
            } catch (e) {}
          } else {
            if (modifyCnt) {
              followCnt = Math.max(followCnt - 1, 0);
            }
            try {
              track_event('Unfollow Store', {
                seller_id: params.seller_id
              });
            } catch (e) {}
          }
          modifyFollow = function modifyFollow() {
            $this.find("small").text(followCnt);
          }
        }
        url = isFollow ? '/add_follow.xml' : '/delete_follow.xml';
      }

      $.ajax({
        type: 'post',
        url: url,
        data: params,
        dataType: 'xml',
        success: function (xml) {
          var $xml = $(xml),
            $st = $xml.find('status_code');
          if (!$st.length || $st.text() != 1) {
            $this.attr('class', $this.data('old'));
          }

          if ($this.attr('follow-lists')) {
            var $deletedItem = $this.closest('li.vcard');
            $deletedItem.remove();
          }
          if (modifyFollow) {
            modifyFollow();
          }
        },
        error: function () {
          $this.attr('class', $this.data('old'));
        },
        complete: function () {
          $this.removeClass('loading');
        }
      });
    },
    mouseenter: function () {
      if ($(this).hasClass('following'))
        $(this).attr('class', 'btn-follow unfollow');
    },
    mouseleave: function () {
      if ($(this).hasClass('unfollow'))
        $(this).attr('class', 'btn-follow following');
    }
  }, '.btn-follow');

  $.dialog('report-user').$obj
    .find(".btn-report").click(function (e) {
      e.preventDefault();
      var $this = $(this);
      var username = $this.attr('username');
      var reason = $this.closest('.popup').find("textarea").val();
      $.ajax({
        type: 'post',
        url: '/' + username + '/submit-inappropriate-user.json',
        data: {
          reason: reason
        },
        dataType: 'json',
        success: function (json) {
          // to do something?
          if (json.status_code) {
            $this.closest('.popup').find('.success').show();
            $('.report').addClass('reported').html(gettext('Cancel Report'))
          }
        }
      }).fail(function (xhr) {
        try {
          var json = JSON.parse(xhr.responseText)
          var error = json.error || json.message
          if (error) {
            alertify.alert(error)
            return
          }
        } catch (e) {}
        alertify.alert("Error occured. please try again.\n" + xhr.status + ' ' + xhr.statusText);
      });
    })

  // report seller
  $('.report').click(function (event) {
    var $this = $(this);

    event.preventDefault();

    if ($this.attr('require_login') === 'true') return require_login();

    if ($this.hasClass('reported')) {
      var original_labels = alertify.labels;
      alertify.set({
        'labels': {
          ok: 'Cancel Report',
          cancel: 'Go Back'
        }
      });

      alertify.confirm(gettext('Are you sure you want to cancel your report?'), function (e) {
        if (e) {
          var username = $this.attr('username');
          $.ajax({
            type: 'post',
            url: '/' + username + '/cancel-inappropriate-user.json',
            dataType: 'json',
            success: function (json) {
              // to do something?
              if (json.status_code) {
                alertify.alert(gettext("Report cancelled."));
                $this.removeClass('reported').html(gettext('Report Store'))
              }
            }
          });
        } else {
          return;
        }
      });
      alertify.set({
        'labels': original_labels
      });

    } else {
      $('.popup.report-user .success').removeAttr('style');
      $.dialog('report-user').open();
    }
    return false;
  });



  // contact

  $contactPopup = $(".popup.store-contact");
  $contactPopup
    .find(".btn-cancel").click(function (e) {
      $.dialog('store-contact').close();
    })
    .end()
    .find('.btn-send').click(function (e) {
      var from_email = $contactPopup.find("input[name=from-email]").val();
      var from_name = $contactPopup.find("input[name=from-name]").val();
      var seller_username = $contactPopup.find("input[name=seller-username]").val();
      var copy_email = $contactPopup.find("#copy-email")[0].checked;
      var subject = $contactPopup.find("input[name=subject]").val();
      var message = $contactPopup.find("textarea[name=message]").val();

      if (!subject) {
        alertify.alert("Please enter subject");
        $contactPopup.find("input[name=subject]").focus();
        return;
      }
      if (!message) {
        alertify.alert("Please enter message");
        $contactPopup.find("textarea[name=message]").focus();
        return;
      }

      var params = {
        from_email: from_email,
        from_name: from_name,
        seller_username: seller_username,
        copy_email: copy_email,
        subject: subject,
        message: message
      }
      $.ajax({
        type: 'post',
        url: '/send_email_to_seller.json',
        data: params,
        dataType: 'json',
        success: function (json) {
          // to do something?
          if (json.status_code) {
            //alert(gettext("Email Sent"));						
          } else {
            //alert(gettext("Failed"));
          }
          $contactPopup.find("input[name=subject]").val("");
          $contactPopup.find("textarea[name=message]").val("");
          $.dialog('store-contact').close();
        },
        error: function () {
          //alert(gettext("Failed"));
          $contactPopup.find("input[name=subject]").val("");
          $contactPopup.find("textarea[name=message]").val("");
          $.dialog('store-contact').close();
        }
      });
    })
    .end()

  $(".active-selling.active").click(function (e) {
    e.preventDefault();
    var spid = $(this).attr("spid");
    $.ajax({
      type: 'post',
      url: '/active_seller_selling.json',
      data: {
        spid: spid
      },
      dataType: 'json',
      success: function (json) {
        // to do something?
        if (json.status_code) {
          location.reload();
        } else {
          alertify.alert(gettext("Failed. try again"));
        }
      },
      error: function () {
        alertify.alert(gettext("Failed. try again"));
      }
    });
  });
  $(".active-selling.inactive").click(function (e) {
    e.preventDefault();
    var spid = $(this).attr("spid");
    if (confirm("Are you sure?")) {
      $.ajax({
        type: 'post',
        url: '/inactive_seller_selling.json',
        data: {
          spid: spid
        },
        dataType: 'json',
        success: function (json) {
          // to do something?
          if (json.status_code) {
            location.reload();
          } else {
            alertify.alert(gettext("Failed. try again"));
          }
        },
        error: function () {
          alertify.alert(gettext("Failed. try again"));
        }
      });
    }
  });

  $(".toggle_active_brand_cover").click(function (e) {
    e.preventDefault();
    var spid = $(this).attr("spid");
    var active_state = $(this).attr('active-state').trim();
    if (confirm("Are you sure?")) {
      $.ajax({
        type: 'post',
        url: '/set_seller_brand_cover.json',
        data: {
          spid: spid,
          state: active_state
        },
        dataType: 'json',
        success: function (json) {
          // to do something?
          if (json.status_code) {
            location.reload();
          } else {
            alertify.alert(gettext("Failed. try again"));
          }
        },
        error: function () {
          alertify.alert(gettext("Failed. try again"));
        }
      });
    }
  });

  $(".toggle_show_in_newest").click(function (e) {
    e.preventDefault();
    var spid = $(this).attr("spid");
    var show_in_newest = $(this).hasClass('on') ? "false" : "true";
    $.ajax({
      type: 'post',
      url: '/set_seller_show_newest.json',
      data: {
        spid: spid,
        show_in_newest: show_in_newest
      },
      dataType: 'json',
      success: function (json) {
        // to do something?
        if (json.status_code) {
          location.reload();
        } else {
          alertify.alert(gettext("Failed. try again"));
        }
      },
      error: function () {
        alertify.alert(gettext("Failed. try again"));
      }
    });
  });

  $(".toggle_category_approved").click(function (e) {
    e.preventDefault();
    var uid = $(this).attr("uid");
    var value = $(this).hasClass('on') ? "false" : "true";
    $.ajax({
      type: 'post',
      url: '/admin/update-merchant-options.json',
      data: {
        seller_id: uid,
        category_approved: value
      },
      dataType: 'json',
      success: function (json) {
        // to do something?
        if (json.status_code) {
          location.reload();
        } else {
          alertify.alert(gettext("Failed. try again"));
        }
      },
      error: function () {
        alertify.alert(gettext("Failed. try again"));
      }
    });
  });

  // from user/profile.js
  var dlg = $.dialog('followers-lists');

  var isLoading = false;

  function loadUsers(url, callback) {
    if (isLoading) return;
    isLoading = true;
    dlg.$obj.find("div > ul").append('<li class="loading"></li> ');

    $.ajax({
      type: 'get',
      url: url,
      dataType: 'html',
      success: function (html) {
        isLoading = false;
        callback(html);
      }
    });
  }

  function userScroll(e) {
    var $this = $(this);
    var scrollTop = $this.scrollTop();
    var scrollHeight = $this[0].scrollHeight;
    if (scrollTop > scrollHeight - $this.height() - 100) {
      var nextUrl = $this.closest(".popup").find("a.btn-next").attr('href');
      if (nextUrl) {
        loadUsers(nextUrl, function (html) {
          var $html = $(html);
          dlg.$obj.find("div > ul").find('li.loading').remove().end().append($html.find("li")).end();
          var nextUrl = $html.find("a.btn-next").attr("href");
          if (nextUrl) {
            dlg.$obj.find("div a.btn-next").attr('href', nextUrl);
          } else {
            dlg.$obj.find("div a.btn-next").remove();
          }
        });
      }
    }
  };

  $("#view-followers").click(function (e) {
    e.preventDefault();
    var username = $(this).attr('username');
    dlg.$obj.addClass('loading').find("p.ltit").html("Followers").end().find("div").empty();
    loadUsers('/shop/' + username + '/followers?popup', function (html) {
      dlg.$obj.removeClass('loading').find("div").html(html);
      dlg.$obj.find("div > ul").off('scroll').on('scroll', userScroll);
    });
    dlg.open();
    return false;
  })
});
