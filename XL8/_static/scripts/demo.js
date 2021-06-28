var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
});

function update_languages_dropdown() {
  $(".language_from")
    .html(populateLanguageSelectOptions(Object.keys(availableLanguages)))
    .find("li a")
    .on("click", function () {
      $(this)
        .closest(".dropdown")
        .find("a")
        .removeClass("current")
        .end()
        .end()
        .addClass("current");
      $(this).closest(".dropdown").find("> a").text($(this).text());
      $(this).closest(".dropdown").toggleClass("opened");
      $(".language_to").closest(".dropdown").find("a").removeClass("current");
      $(".language_to").closest(".dropdown").find("> a").text("Language To");

      const source = $(".language_from").find(".current").attr("code");
      $(".language_to").html(
        populateLanguageSelectOptions(availableLanguages[source])
      );
      $(".language_to")
        .find("li a")
        .on("click", function () {
          $(this)
            .closest(".dropdown")
            .find("a")
            .removeClass("current")
            .end()
            .end()
            .addClass("current");
          $(this).closest(".dropdown").find("> a").text($(this).text());
          $(this).closest(".dropdown").toggleClass("opened");

          return false;
        });
      return false;
    });
}

jQuery(function ($) {
  $("#text_editor").on("change keyup paste cut", function () {
    $("#text_editor")
      .closest("p")
      .find(".byte i")
      .text($("#text_editor").val().length);
    if ($("#text_editor").val().length > 350) {
      $("#text_editor").height(140);
    }
  });

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
  $(".translate-language")
    .find(".dropdown > a")
    .on("click", function () {
      $(this).closest(".dropdown").toggleClass("opened");
      return false;
    });
  $(".translator-tab a").click(function () {
    $(".translator-editor").hide();
    $(this)
      .closest("ul")
      .find("a")
      .removeClass("current")
      .end()
      .end()
      .addClass("current");
    $(".translator-editor." + $(this).data("type")).show();
    return false;
  });
  $(".btn-submit").on("click", function () {
    return false;
  });
  $(".btn-find").on("click", function () {
    return false;
  });
  $(".btn-upload").on("click", function () {
    return false;
  });
  $(".signup").on("click", function () {
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
  update_languages_dropdown();
});

loadLanguages(3, function () {
  jQuery(function ($) {
    //
    // Text Translation Demo
    //
    update_languages_dropdown();

    $(".btn-submit").on("click", function () {
      const text_count = localStorage.getItem("xl8.demo.trans.text.count");
      if (!text_count) {
        localStorage.setItem("xl8.demo.trans.text.count", "0");
      } else if (parseInt(text_count) && parseInt(text_count) % 5 == 0) {
        $("html, body").animate(
          { scrollTop: $("#translationstarted").offset().top - 105 },
          1000
        );
        localStorage.setItem("xl8.demo.trans.text.count", "0");
        return false;
      }

      const source = $(".language_from").find(".current").attr("code");
      const target = $(".language_to").find(".current").attr("code");
      const sentences = $(".translator-frm textarea").val();

      if (
        source === undefined ||
        source == "" ||
        target === undefined ||
        target == "" ||
        sentences == ""
      ) {
        return false;
      }

      $(".btn-submit").prop("disabled", true).hide();
      $(".text_spinner").show();
      sendDemoTransRequest(sentences, source, target, function (
        sentences,
        sentences_google
      ) {
        $(".text_spinner").hide();
        $(".btn-submit").prop("disabled", false).show();
        $(".google pre").text(sentences_google);
        $(".xl8 pre").text(sentences);
        $("html, body").animate(
          { scrollTop: $("#translator-tab").offset().top },
          1000
        );
      });

      return false;
    });

    //
    // Subtitle Demo
    //
    $(".btn-find").on("click", function () {
      const input = $(".translator-editor.file .file");
      input.trigger("click"); // opening dialog
      input.change(function (e) {
        const filename = e.target.files[0].name;
        $(".translator-editor.file .text").val(filename);
      });
      return false;
    });
    $(".btn-upload").on("click", function (e) {
      const file_count = localStorage.getItem("xl8.demo.trans.file.count");
      if (!file_count) {
        localStorage.setItem("xl8.demo.trans.file.count", "0");
      } else if (parseInt(file_count) && parseInt(file_count) % 2 == 0) {
        $("html, body").animate(
          { scrollTop: $("#translationstarted").offset().top - 105 },
          1000
        );
        localStorage.setItem("xl8.demo.trans.file.count", "0");
        return false;
      }

      const source = $(".language_from").find(".current").attr("code");
      const target = $(".language_to").find(".current").attr("code");
      const file = document.getElementById("file").files[0];

      if (
        source === undefined ||
        source == "" ||
        target === undefined ||
        target == "" ||
        file === undefined ||
        !file
      ) {
        return false;
      }

      $(".btn-find").prop("disabled", true);
      $(".btn-upload").prop("disabled", true).hide();
      $(".file_spinner").show();
      $("#file_text").text(
        "Please wait and your translated file will be downloaded shortly."
      );
      uploadFile(file, source, target, function () {
        $("#file_text").text("Upload a    SRT, PAC, or XIF.");
        $(".btn-find").prop("disabled", false);
        $(".btn-upload").prop("disabled", false).show();
        $(".file_spinner").hide();
      });
      return false;
    });
  });
});
