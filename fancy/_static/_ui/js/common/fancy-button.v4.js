(function($) {
    "use static";

    $(function() {

        function setNextFancyCnt(curr, inc, node) {
            var fancydCntStr = curr.trim();
            var amount = inc ? +1 : -1;
            var changeCount = true;
            if (curr.toLowerCase().indexOf('k') !== -1 || curr.toLowerCase().indexOf('m') !== -1) {
                changeCount = false;
            }
            if (changeCount) {
                var fancydCnt = parseInt(fancydCntStr.replace(/,/g, ""), 10) || 0;
                var nextFancydCnt = Math.max(0, fancydCnt + amount);
                if (node.nodeValue !== undefined) {
                    node.nodeValue = addCommas(nextFancydCnt);
                } else {
                    $(node).text(addCommas(nextFancydCnt));
                }
            }
        }

        function getCordialProperties($btn) {
            var $fig = $btn.closest(".figure-item");
            return {
                "thingID": $fig.attr("data-tid"), "productID": $fig.attr("data-id"), "seller": $fig.attr("data-seller"), 
                "url": "https://fancy.com" + $fig.attr("data-url"),
                "name": $fig.attr("data-title"), "category": $fig.attr("data-scate"),
                "instock": $fig.attr("data-status") == "Active", "image": $fig.attr("data-img"),
                "price": parseFloat($fig.attr("data-sprice"))
            }
        }

        // when click Fancy Button
        $(document.body).delegate("a.fancyd, a.fancy, button.fancyd, button.fancy", "click", function(event) {
            event.preventDefault();

            if ($(this).attr("v") != 4) return;

            var $this = $(this),
                tid = $this.attr("tid") || $this.attr("data-tid") || null,
                aid = $this.attr("aid") || $this.attr("data-aid") || null,
                fancyd = $this.hasClass("fancyd"),
                login_require = !(window.__FancyUser != null && window.__FancyUser.loggedIn);

            if (!tid && !aid) return;

            if ($this.data("loading")) return;
            $this.data("loading", true);

            if (login_require && login_require == "true") return require_login();

            $this.disable();

            // unfancy
            if (fancyd) {
                // setNextFancyCnt($this.text(), false, $this[0].lastChild);
                // $this.removeClass('fancyd').addClass('fancy');

                //     var $fancydUser = $this.closest('.buttons, li').find("span.fancyd_user");
                //     if( $fancydUser.find("._viewer:visible").length ){
                //       $fancydUser.find("._viewer:visible").addClass('picker').end().addClass('remove').find("._viewer").hide().end();
                // if ($fancydUser.attr('max-count')) {
                //   $fancydUser.find('.user:nth-child('+$fancydUser.attr('max-count')+')').show();
                // }
                //       setTimeout(function(){
                //         $fancydUser.removeClass('remove').find("._viewer.picker").removeClass('picker');
                //         $fancydUser.find("._viewer:eq(1)").remove();
                //       },1000);
                // }

                function unfancyThing(tid) {
                    updateThing(tid, { fancyd: false })
                        .done(function(json) {
                            if (json.fancyd) return;
                            // var text = gettext("Fancy");
                            var $button = $(".fancyd, .fancy").filter(
                                '[tid="' + json.id + '"], [data-tid="' + json.id + '"]'
                            );

                            if ($button.length) {
                                // $button.filter(":not(._count)").each(function() {
                                //     this.lastChild.nodeValue = text;
                                // });
                                $button
                                    .removeAttr("rtid")
                                    .removeAttr("data-rtid")
                                    .removeClass("fancyd")
                                    .addClass("fancy")
                                    .closest(".figure-item")
                                    .find(".button-static.fancy")
                                    .removeClass("fancyd");

                                $button
                                    .filter(":not(._count)")
                                    .closest(".figure-item")
                                    .find(".button-static.fancy")
                                    .html('<span class="icon" />');

                                // var fancydCnt = $this.closest('.figure-button').find('a.fancyd_list').text().replace(/,/g,'');
                                // if(fancydCnt && !isNaN(fancydCnt)){
                                //   var $fancyd_list = $this.find('.figure-button').find('a.fancyd_list');
                                //   $fancyd_list.text(addCommas(parseInt(fancydCnt,10)-1));
                                //   if (fancydCnt === 1){
                                //     $fancyd_list.addClass('default');
                                //   }
                                // }
                                var $fancyd = $this
                                    .closest(".figure-item")
                                    .find(".fancy, .fancyd");
                                var fancydCnt = $fancyd.text().replace(/[\+,]/g, "");
                                setNextFancyCnt(fancydCnt, false, $fancyd);
                            }
                            // refresh cache to save fancyd state
                            $(window).trigger("savestream.infiniteshow");
                            track_event("Unfancy", { thing_id: tid });
                        })
                        .fail(function(e) {
                            if (e.status == 403) {
                                location.href = "/login";
                            } else if (e.status === 400) {
                                alertify.alert("This item is not available or has been deleted.");
                                var $button = $(".fancyd, .fancy").filter(
                                    '[tid="' + tid + '"], [data-tid="' + tid + '"]'
                                );
                                $button.removeClass("fancy").addClass("fancyd");
                            }
                        })
                        .always(function() {
                            $this.disable(false);
                            $this.data("loading", false);
                        });
                }

                function unfancyArticle(aid) {
                    updateArticle(aid, { action: "unsave" })
                        .done(function(json) {
                            if (json.saved) return;
                            var text = gettext("Fancy");

                            var $button = $(".fancyd, .fancy").filter(
                                '[aid="' + json.article_id + '"], [data-aid="' + json.article_id + '"]'
                            );

                            if ($button.length) {
                                $button.filter(":not(._count)").each(function() {
                                    this.lastChild.nodeValue = text;
                                });
                                $button
                                    .removeClass("fancyd")
                                    .addClass("fancy")
                                    .closest(".figure-item")
                                    .find(".button-static.fancy")
                                    .removeClass("fancyd");

                                $button
                                    .filter(":not(._count)")
                                    .closest(".figure-item")
                                    .find(".button-static.fancy")
                                    .html('<span class="icon"></span>' + text);

                                // var fancydCnt = $this.closest('.figure-button').find('a.fancyd_list').text().replace(/,/g,'');
                                // if(fancydCnt && !isNaN(fancydCnt)){
                                //   var $fancyd_list = $this.find('.figure-button').find('a.fancyd_list');
                                //   $fancyd_list.text(addCommas(parseInt(fancydCnt,10)-1));
                                //   if (fancydCnt === 1){
                                //     $fancyd_list.addClass('default');
                                //   }
                                // }
                                var $fancyd = $this
                                    .closest(".figure-item")
                                    .find(".fancy, .fancyd");
                                var fancydCnt = $fancyd.text().replace(/[\+,]/g, "");
                                setNextFancyCnt(fancydCnt, false, $fancyd);
                            }
                            // refresh cache to save fancyd state
                            $(window).trigger("savestream.infiniteshow");
                            track_event("Unsave Article", { article_id: aid });
                        })
                        .fail(function(e) {
                            if (e.status == 403) {
                                location.href = "/login";
                            } else if (e.status === 400) {
                                alertify.alert("This item is not available or has been deleted.");
                                var $button = $(".fancyd, .fancy").filter(
                                    '[aid="' + aid + '"], [data-aid="' + aid + '"]'
                                );
                                $button.removeClass("fancy").addClass("fancyd");
                            }
                        })
                        .always(function() {
                            $this.disable(false);
                            $this.data("loading", false);
                        });
                }

                if (tid) unfancyThing(tid);
                if (aid) unfancyArticle(aid);

                return;
            } else {
                $this.addClass("loading");

                // fancy
                // var bgIdx =[0, -54, -108, -163, -218, -272, -327, -436, -490, -545, -599, -654, -708, -763, -817, -872, -926, -981, -1035, -1144, -1199, -1253, -1308, -1417, -1471];
                // var fancydCnt = $this.text();
                // if( !isNaN(fancydCnt) ){
                //   fancydCnt = Math.max(0, (parseInt(fancydCnt.replace(/,/g,''), 10)||0)+1 );
                //   $this[0].lastChild.nodeValue = addCommas(fancydCnt);
                // }

                // function setButtonBg(idx){
                //   if(bgIdx[idx]!=null){
                //     $this.find("span").css('background-position-x', bgIdx[idx]+"px");
                //     setTimeout(function(){setButtonBg(idx+1)}, 10);
                //   }else{
                //     $this.removeClass('loading').removeClass('fancy').addClass('fancyd');
                //   }
                // }
                // setButtonBg(0);
                $this.removeClass('loading').removeClass('fancy').addClass('fancyd');

                //     var $fancydUser = $this.closest('.buttons, li').find("span.fancyd_user");
                //     $fancydUser.find("._viewer:first").addClass('picker').end().addClass('add').find("._viewer:first").css('display','inline').end();
                // if ($fancydUser.attr('max-count')) {
                //   $fancydUser.find('.user:nth-child('+$fancydUser.attr('max-count')+')').hide();
                // }
                //     setTimeout(function(){$fancydUser.removeClass('add').find("._viewer:first").removeClass('picker')},1000);

                function fancyThing(tid) {
                    updateThing(tid, { fancyd: true })
                        .done(function(json) {
                            if (!json.fancyd) return;
                            var text = gettext("Fancy'd");

                            var $button = $(".fancyd, .fancy").filter(
                                '[tid="' + json.id + '"], [data-tid="' + json.id + '"]'
                            );

                            if ($button.length) {
                                $button.filter(":not(._count)").each(function() {
                                    this.lastChild.nodeValue = text;
                                });
                                $button
                                    .attr("rtid", json.rtid || "1")
                                    .removeClass("fancy")
                                    .addClass("fancyd")
                                    .closest(".figure-item")
                                    .find(".button-static.fancy")
                                    .removeClass("fancyd");

                                $button
                                    .filter(":not(._count)")
                                    .closest(".figure-item")
                                    .find(".button-static.fancy")
                                    .html('<span class="icon"></span>' + text);

                                // var fancydCnt = $this.closest('.figure-button').find('a.fancyd_list').text().replace(/,/g,'');
                                // if(fancydCnt && !isNaN(fancydCnt)){
                                //   var $fancyd_list = $this.find('.figure-button').find('a.fancyd_list');
                                //   $fancyd_list.text(addCommas(parseInt(fancydCnt,10)+1));
                                //   if (fancydCnt === 1){
                                //     $fancyd_list.addClass('default');
                                //   }
                                // }
                                var $fancyd = $this
                                    .closest(".figure-item")
                                    .find(".fancy, .fancyd");
                                var fancydCnt = $fancyd.text().replace(/[\+,]/g, "");
                                setNextFancyCnt(fancydCnt, true, $fancyd);
                            }
                            // refresh cache to save fancyd state
                            $(window).trigger("savestream.infiniteshow");
                            track_event("Fancy", { thing_id: tid });
                            try {
                                try {
                                    crdl("event", "favorite_item", getCordialProperties($this));
                                } catch (e) {
    
                                }
                            } catch (e) {

                            }
                        })
                        .fail(function(e) {
                            if (e.status == 403) {
                                location.href = "/login";
                            } else if (e.status === 400) {
                                alertify.alert("This item is not available or has been deleted.");
                                var $button = $(".fancyd, .fancy").filter(
                                    '[tid="' + tid + '"], [data-tid="' + tid + '"]'
                                );
                                $button.removeClass("fancyd").addClass("fancy");
                            }
                        })
                        .always(function() {
                            $this.disable(false);
                            $this.data("loading", false);
                        });
                }

                function fancyArticle(aid) {
                    updateArticle(aid, { action: "save" })
                        .done(function(json) {
                            if (!json.saved) return;
                            var text = gettext("Fancy'd");

                            var $button = $(".fancyd, .fancy").filter(
                                '[aid="' + json.article_id + '"], [data-aid="' + json.article_id + '"]'
                            );

                            if ($button.length) {
                                $button.filter(":not(._count)").each(function() {
                                    this.lastChild.nodeValue = text;
                                });
                                $button
                                    .removeClass("fancy")
                                    .addClass("fancyd")
                                    .closest(".figure-item")
                                    .find(".button-static.fancy")
                                    .removeClass("fancyd");

                                $button
                                    .filter(":not(._count)")
                                    .closest(".figure-item")
                                    .find(".button-static.fancy")
                                    .html('<span class="icon"></span>' + text);

                                // var fancydCnt = $this.closest('.figure-button').find('a.fancyd_list').text().replace(/,/g,'');
                                // if(fancydCnt && !isNaN(fancydCnt)){
                                //   var $fancyd_list = $this.find('.figure-button').find('a.fancyd_list');
                                //   $fancyd_list.text(addCommas(parseInt(fancydCnt,10)+1));
                                //   if (fancydCnt === 1){
                                //     $fancyd_list.addClass('default');
                                //   }
                                // }
                                var $fancyd = $this
                                    .closest(".figure-item")
                                    .find(".fancy, .fancyd");
                                var fancydCnt = $fancyd.text().replace(/[\+,]/g, "");
                                setNextFancyCnt(fancydCnt, true, $fancyd);
                            }
                            // refresh cache to save fancyd state
                            $(window).trigger("savestream.infiniteshow");
                            track_event("Save Article", { article_id: aid });
                        })
                        .fail(function(e) {
                            if (e.status == 403) {
                                location.href = "/login";
                            } else if (e.status === 400) {
                                alertify.alert("This item is not available or has been deleted.");
                                var $button = $(".fancyd, .fancy").filter(
                                    '[aid="' + aid + '"], [data-aid="' + aid + '"]'
                                );
                                $button.removeClass("fancyd").addClass("fancy");
                            }
                        })
                        .always(function() {
                            $this.disable(false);
                            $this.data("loading", false);
                        });
                }

                if (tid) fancyThing(tid);
                if (aid) fancyArticle(aid);
            }
        });

        function updateThing(thing_id, data) {
            return $.ajax({
                type: "PUT",
                url: "/rest-api/v1/things/" + thing_id,
                data: data
            });
        }

        function updateArticle(article_id, data) {
            data.article_id = article_id;
            return $.ajax({
                type: "POST",
                url: "/articles/save.json",
                data: data
            });
        }
    });
})(jQuery);
