(self["webpackChunkfancy"] = self["webpackChunkfancy"] || []).push([["OverlayThing.admin"],{

/***/ "./_static/_ui/js/ajaxfileupload.js":
/*!******************************************!*\
  !*** ./_static/_ui/js/ajaxfileupload.js ***!
  \******************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
/***/ (() => {

// Support HTML5 file upload by taegon kim
;

(function ($) {
  var xhr, plugin;
  if (window.XMLHttpRequest) xhr = new window.XMLHttpRequest();

  if (xhr && 'upload' in xhr && 'onprogress' in xhr.upload && window.FileReader && window.FormData) {
    // yeap! this browser supports HTML5 ajax file upload!
    plugin = {
      ajaxFileUpload: function ajaxFileUpload(s) {
        var xhr = new window.XMLHttpRequest(),
            reader = new FileReader(),
            $file,
            file,
            xml = {}; // import global settings

        s = $.extend({}, $.ajaxSettings, s); // get a file object

        $file = $('#' + s.fileElementId);
        file = $file[0].files[0];

        reader.onload = function (event) {
          var data = new FormData();
          data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
          data.append($file.attr('name'), file);
          var settings = {
            url: s.url,
            type: 'POST',
            data: data,
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            success: s.success || $.noop,
            error: s.error || $.noop,
            complete: s.complete || $.noop,
            xhr: function xhr() {
              var xhr = $.ajaxSettings.xhr();

              xhr.upload.onprogress = function (event) {
                var percent = 0,
                    pos = event.loaded || event.position,
                    total = event.total;

                if (event.lengthComputable) {
                  percent = Math.ceil(pos / total * 100);
                  (s.progress || $.noop)(percent);
                }
              };

              return xhr;
            }
          };
          if (s.dataType) settings.dataType = s.dataType;
          $.ajax(settings);
        };

        reader.onerror = function () {
          if (s.error) s.error();
          if (s.complete) s.complete();
        };

        reader.readAsArrayBuffer(file);
      }
    };
  } else {
    // for old browser
    plugin = {
      createUploadIframe: function createUploadIframe(id, uri) {
        //create frame
        var frameId = 'jUploadFrame' + id,
            $io;
        $io = $('<iframe id="' + frameId + '" name="' + frameId + '" />');

        if (window.ActiveXObject) {
          if (typeof uri == 'boolean') {
            $io[0].src = 'javascript:false';
          } else if (typeof uri == 'string') {
            $io[0].src = uri;
          }
        }

        $io.css({
          position: 'absolute',
          top: -1000,
          left: -1000
        }).appendTo('body');
        return $io;
      },
      createUploadForm: function createUploadForm(id, fileElementId) {
        //create form
        var formId = 'jUploadForm' + id,
            fileId = 'jUploadFile' + id,
            csrfId = 'jUploadCSRF' + id;
        var $form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        var $oldFile = $('#' + fileElementId),
            $newFile = $oldFile.clone(true);
        $oldFile.attr('id', fileId).before($newFile).appendTo($form); // CSRF 

        var $inputHidden = $('#' + csrfId);

        if (!$inputHidden.length) {
          $inputHidden = $('<input type="hidden" id="' + csrfId + '" name="csrfmiddlewaretoken">').appendTo($form);
        }

        $inputHidden.val(getCookie('csrftoken')); // remove the previous form and add new form

        $form.css({
          position: 'absolute',
          top: -1000,
          left: -1000
        }).appendTo('body');
        return $form;
      },
      ajaxFileUpload: function ajaxFileUpload(s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
        s = $.extend({}, $.ajaxSettings, s);
        var id = new Date().getTime();
        var frameId = 'jUploadFrame' + id,
            formId = 'jUploadForm' + id;
        var $form = $.createUploadForm(id, s.fileElementId);
        var $io = $.createUploadIframe(id, s.secureuri); // Watch for a new set of requests

        if (s.global && !$.active++) {
          $.event.trigger("ajaxStart");
        }

        var requestDone = false,
            xml = {}; // Create the request object

        if (s.global) $.event.trigger("ajaxSend", [xml, s]); // Wait for a response to come back

        var uploadCallback = function uploadCallback(isTimeout) {
          var io = document.getElementById(frameId);

          try {
            if (io.contentWindow) {
              xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
              xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
            } else if (io.contentDocument) {
              xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
              xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
            }
          } catch (e) {
            $.handleError(s, xml, null, e);
          }

          if (xml || isTimeout == "timeout") {
            requestDone = true;
            var status;

            try {
              status = isTimeout != "timeout" ? "success" : "error"; // Make sure that the request was successful or notmodified

              if (status != "error") {
                // process the data (runs the xml through httpData regardless of callback)
                var data = $.uploadHttpData(xml, s.dataType); // If a local callback was specified, fire it and pass it the data

                if (s.success) s.success(data, status); // Fire the global callback

                if (s.global) $.event.trigger("ajaxSuccess", [xml, s]);
              } else {
                $.handleError(s, xml, status);
              }
            } catch (e) {
              status = "error";
              $.handleError(s, xml, status, e);
            } // The request was completed


            if (s.global) $.event.trigger("ajaxComplete", [xml, s]); // Handle the global AJAX counter

            if (s.global && ! --jQuery.active) $.event.trigger("ajaxStop"); // Process result

            if (s.complete) s.complete(xml, status);
            $io.off();
            setTimeout(function () {
              try {
                $io.remove();
                $form.remove();
              } catch (e) {
                $.handleError(s, xml, null, e);
              }
            }, 100);
            xml = null;
          }
        }; // Timeout checker


        if (s.timeout > 0) {
          setTimeout(function () {
            // Check to see if the request is still happening
            if (!requestDone) uploadCallback("timeout");
          }, s.timeout);
        }

        try {
          var enctype = 'multipart/form-data';
          $form.attr({
            action: s.url,
            method: 'POST',
            target: frameId,
            enctype: enctype
          }).submit();
        } catch (e) {
          $.handleError(s, xml, null, e);
        }

        if (window.attachEvent) {
          document.getElementById(frameId).attachEvent('onload', uploadCallback);
        } else {
          document.getElementById(frameId).addEventListener('load', uploadCallback, false);
        }

        return {
          abort: function abort() {}
        };
      },
      uploadHttpData: function uploadHttpData(r, type) {
        var data = !type || type == "xml" ? r.responseXML : r.responseText; // If the type is "script", eval it in global context

        if (type == "script") $.globalEval(data); // Get the JavaScript object, if JSON is used.

        if (type == "json") data = $.parseJSON($(r.responseText).text()); // evaluate scripts within html

        if (type == "html") $("<div>").html(data).evalScripts();
        return data;
      }
    };
  }

  jQuery.extend(plugin);

  if (!jQuery.handleError) {
    jQuery.extend({
      handleError: function handleError(s, xhr, status, e) {
        if (s.error) {
          s.error.call(s.context || window, xhr, status, e);
        }

        if (s.global) {
          (s.context ? $(s.context) : $.event).trigger('ajaxError', [xhr, s, e]);
        }
      }
    });
  }
})(window.jQuery);

function getCookie(name) {
  var regex = new RegExp('(^|[ ;])' + name + '\\s*=\\s*([^\\s;]+)');
  return regex.test(document.cookie) ? unescape(RegExp.$2) : null;
}

/***/ })

}]);
//# sourceMappingURL=OverlayThing.admin.db09eb762af8c32c5be5.js.map