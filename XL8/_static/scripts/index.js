var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
});

jQuery(function ($) {
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

  var $testimonials = $(".testimonials").find("ul");
  var $testimonialsItems = $testimonials.find("> li");
  var maxPage = $testimonialsItems.length;

  $(".testimonials")
    .find("a.next")
    .click(function (e) {
      e.preventDefault();
      var scrollArea = $testimonials.outerWidth();
      var page = $testimonials.attr("page") || 1;
      if (page == maxPage) return;
      page++;
      var newLeft = (page - 1) * scrollArea;
      $testimonials.animate({ scrollLeft: newLeft }, 200);
      $testimonials.attr("page", page);
      if (page == maxPage) {
        $(".testimonials").find("a.next").addClass("disabled");
      }
      $(".testimonials").find("a.prev").removeClass("disabled");
    })
    .end()
    .find("a.prev")
    .click(function (e) {
      e.preventDefault();
      var scrollArea = $testimonials.outerWidth();
      var page = $testimonials.attr("page") || 1;
      if (page == 1) return;
      page--;
      var newLeft = (page - 1) * scrollArea;
      $testimonials.animate({ scrollLeft: newLeft }, 200);
      $testimonials.attr("page", page);
      if (page == 1) {
        $(".testimonials").find("a.prev").addClass("disabled");
      }
      $(".testimonials").find("a.next").removeClass("disabled");
    });
  if (maxPage == 1) {
    $(".testimonials").find("a.prev, a.next").hide().addClass("disabled");
  }
  $(window).resize(function () {
    $testimonials.scrollLeft(0);
    var page = $testimonials.attr("page") || 1;
    if (page == 1) return;
    $testimonials.scrollLeft((page - 1) * $testimonials.outerWidth());
  });

  $(".sendnow").on("click", function () {
    const fname = $("#fname").val();
    const cname = $("#cname").val();
    const email = $("#email").val();
    const msg = $("#msg").val();
    if (!checkContactUsForm(fname, cname, email, msg)) {
      return false;
    }
    $(".signup").prop("disabled", true);
    sendContactUsRequest(fname, cname, email, msg, function () {
      alert("Thanks for reaching us out! We'll contact you shortly.");
      $(".signup").prop("disabled", false);
    });
    return false;
  });
});
