jQuery(function ($) {
  $(".mask").each(function () {
    var baseH = $(this).data("height");
    var maskH = Math.round(($(window).width() * baseH) / 1200);
    if ($(window).width() < 960) {
      baseH = $(this).data("pad-height");
      maskH = Math.round(($(window).width() * baseH) / 960);
    }
    $(this).height(maskH);
  });

  $(window).resize(function () {
    $(".mask").each(function () {
      var baseH = $(this).data("height");
      var maskH = Math.round(($(window).width() * baseH) / 1200);
      if ($(window).width() < 960) {
        baseH = $(this).data("pad-height");
        maskH = Math.round(($(window).width() * baseH) / 960);
      }
      $(this).height(maskH);
    });
  });

  $(window).scroll(function () {
    if ($(window).scrollTop() > $(".cover").next().offset().top) {
      if ($("#header").hasClass("fixed")) return;
      $("#header").addClass("fixed");
    } else {
      if ($("#header").hasClass("fixed")) $("#header").removeClass("fixed");
    }
  });

  $("#header .m_menu").click(function () {
    $("body").toggleClass("open_header");
    return false;
  });

  function changeCurrent(tab_type, data_type) {
    $(`${tab_type}`)
      .find("a")
      .removeClass("current")
      .end()
      .find(`a[data-type=${data_type}]`)
      .addClass("current");
  }

  $(window).scroll(function () {
    if (!$("body").hasClass("about")) return;
    var HeaderHeight = $("#header").outerHeight();
    if (
      $(window).scrollTop() >
      $(".section[cont-type=location]").offset().top - HeaderHeight
    ) {
      changeCurrent(".tab-hidden", "location");
      changeCurrent(".tab", "location");
    } else if (
      $(window).scrollTop() >
      $(".section[cont-type=core]").offset().top - HeaderHeight
    ) {
      changeCurrent(".tab-hidden", "core");
      changeCurrent(".tab", "core");
    } else if (
      $(window).scrollTop() >
      $(".section[cont-type=team]").offset().top - HeaderHeight
    ) {
      changeCurrent(".tab-hidden", "team");
      changeCurrent(".tab", "team");
    } else if (
      $(window).scrollTop() >
      $(".section[cont-type=mission]").offset().top - HeaderHeight
    ) {
      changeCurrent(".tab-hidden", "mission");
      changeCurrent(".tab", "mission");
    } else {
      changeCurrent(".tab-hidden", "about");
      changeCurrent(".tab", "about");
    }
  });

  function scrollToMenu(obj) {
    var type = obj.attr("data-type"),
      $section = $(".section[cont-type=" + type + "]"),
      sectionT = $section.offset().top - $("#header").outerHeight() + 10;
    $("html,body").stop();
    $("html,body").animate(
      {
        scrollTop: sectionT,
      },
      1000
    );

    return false;
  }
  $(".tab-hidden a[data-type]").click(function () {
    scrollToMenu($(this));
  });
  $(".tab a[data-type]").click(function () {
    scrollToMenu($(this));
  });
});
